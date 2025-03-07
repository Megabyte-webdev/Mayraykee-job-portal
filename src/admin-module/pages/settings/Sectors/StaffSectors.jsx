import React, { useState, useEffect } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { useNavigate } from 'react-router-dom';
import SectorTable from './SectorTable';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import UseAdminManagement from '../../../../hooks/useAdminManagement';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeftLong } from 'react-icons/fa6';
import StaffSectorModal from './StaffSectorModal'; // Modal for Add/Edit

export default function StaffSectors() {
    const [sectors, setSectors] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null); // For passing data to the modal
    const [loading, setLoading] = useState(false); // General loading state for add/edit actions
    const [fetchSectorsLoading, setFetchSectorsLoading] = useState(false); // Specific loading state for fetching sectors
    const [isSubsector, setIsSubsector] = useState(false);
    const navigate = useNavigate();
    const {
        getStaffSectors,
        deleteStaffSectorById,
        deleteStaffSubsectorById,
        createStaffSector,
        createStaffSubsector,
        updateStaffSector,
        updateStaffSubsector
    } = UseAdminManagement();

    useEffect(() => {
        const fetchSectors = async () => {
            setFetchSectorsLoading(true);
            try {
                const data = await getStaffSectors();
                if (data) {
                    setSectors(data);
                } else {
                    console.error("No data received");
                }
            } catch (error) {
                toast.error('Failed to fetch sectors');
            } finally {
                setFetchSectorsLoading(false);
            }
        };
        fetchSectors();
    }, []);

    const items = [
        { label: 'Overview', icon: 'pi pi-list' },
        { label: 'Manage Sectors', icon: 'pi pi-list' },
        { label: 'Manage SubSectors', icon: 'pi pi-info-circle' }
    ];

    const handleAddSubcategory = () => {
        setEditData(null);
        setIsSubsector(true);
        setIsModalOpen(true);
    };

    const handleAddCategory = () => {
        setEditData(null);
        setIsSubsector(false);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        if (activeIndex === 2) {
            handleAddSubcategory();
        } else {
            handleAddCategory();
        }
    };

    const handleEdit = (data) => {
        setEditData(data);
        setIsSubsector(activeIndex === 2);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);

            let response;
            if (activeIndex === 1) {
                response = await deleteStaffSectorById(id);
            } else if (activeIndex === 2) {
                response = await deleteStaffSubsectorById(id);
            }

            // Check if the response contains a 'message' indicating successful deletion
            if (response && response.message && response.message.includes("successfully")) {
                const updatedData = await getStaffSectors();
                setSectors(updatedData);
                toast.success(`${activeIndex === 2 ? 'Subsector' : 'Sector'} deleted successfully`);
            } else {
                // If the message doesn't indicate success or it's missing, handle it as an error
                throw new Error('Failed to delete');
            }
        } catch (err) {
            console.error("Error during delete operation:", err);
            toast.error('Failed to delete');
        } finally {
            setLoading(false);
        }
    };


    const handleModalSubmit = async (data) => {
        try {
            setLoading(true);
            let response;
            const sectorName = data?.name?.toLowerCase().trim();
            const existingSector = data?.category_id
                ? sectors?.find(sector => sector.id === data?.category_id)
                    ?.subcategories?.find(sub => sub?.name?.toLowerCase().trim() === sectorName)
                : sectors?.find(sec => sec?.name?.toLowerCase().trim() === sectorName);
            if (!editData && existingSector) {
                if (data?.category_id) {
                    toast.error(`"${data?.name}" is already a subsector of the selected category.`);
                } else {
                    toast.error(`A category with the name "${data?.name}" already exists.`);
                }
                return;
            }

            // Decide API endpoint based on activeIndex and operation type (edit or create)
            if (editData) {
                response = isSubsector
                    ? await updateStaffSubsector(editData.id, data)
                    : await updateStaffSector(editData.id, data);
            } else {
                response = isSubsector
                    ? await createStaffSubsector(data)
                    : await createStaffSector(data);
            }

            // Check response for success
            if (response?.message?.includes("successfully")) {
                toast.success(`${isSubsector ? "Subsector" : "Sector"} ${editData ? "updated" : "added"} successfully`);
                setIsModalOpen(false); // Close modal only on success
                const updatedData = await getStaffSectors();
                setSectors(updatedData); // Refresh data
            } else {
                throw new Error(response?.message || "Unknown error occurred");
            }
        } catch (err) {
            console.error(err);
            toast.error(`Failed to ${editData ? 'edit' : 'add'} ${isSubsector ? 'subsector' : 'sector'}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="card px-2">
            <div className="px-8 py-5">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
                >
                    <FaArrowLeftLong className="me-4 text-green-500" />Back
                </button>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-center md:text-left">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Staff Sector Management</h1>
                {activeIndex === 2 && <button
                    disabled={loading || fetchSectorsLoading}
                    onClick={handleAdd}
                    className="bg-green-700 px-4 py-2 text-white rounded-md flex items-center justify-center"
                >
                    <FaPlus className="mr-2" />
                    {activeIndex === 2 ? 'Add SubSector' : 'Add Sector'}
                </button>}
            </div>
            <div className="w-full md:w-auto">
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
            </div>
            {fetchSectorsLoading ? (
                <div className="flex justify-center items-center mt-5">
                    <FaSpinner size="24" className="animate-spin" />
                </div>
            ) : (
                <>
                    {activeIndex === 0 && (
                        <SectorTable
                            title="Overview"
                            products={sectors}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            buttons={[]} // No buttons for Overview
                        />
                    )}
                    {activeIndex === 1 && (
                        <SectorTable
                            title="Manage Sectors"
                            products={sectors}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            buttons={['edit', 'delete']}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    )}
                    {activeIndex === 2 && (
                        <SectorTable
                            title="Manage SubSectors"
                            products={sectors}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            buttons={['edit', 'delete']}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    )}
                </>
            )}
            {isModalOpen && (
                <StaffSectorModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    initialData={editData}
                    loading={loading}
                    sectors={sectors}
                    isSubsector={isSubsector}
                />
            )}
        </div>
    );
}
