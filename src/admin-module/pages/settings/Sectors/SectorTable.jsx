import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaEdit, FaTrash, FaList, FaEyeSlash, FaSpinner } from 'react-icons/fa'; // Import icons
import { toast } from 'react-toastify';

const SectorTable = ({
    title,
    products,
    selectedProducts,
    setSelectedProducts,
    buttons,
    onDelete,
    onEdit,
}) => {
    const [loadingId, setLoadingId] = useState(null);

    const handleDelete = async (id) => {
        setLoadingId(id);
        try{
            await onDelete(id);
            setLoadingId(null);
        }catch(err){
            toast.error("An error occured");
            setLoadingId(null);
        }
        
       
    };

    const actionBodyTemplate = (rowData) => (
        <div className="actions flex gap-2">
            {buttons.includes('edit') && (
                <button
                    className="bg-gray-500 text-white px-2 py-2 rounded flex items-center justify-center"
                    onClick={() => onEdit(rowData)}
                    title="Edit"
                >
                    <FaEdit />
                </button>
            )}
            {buttons.includes('delete') && (
                <button
                    className="bg-red-800 text-white px-2 py-2 rounded flex items-center justify-center"
                    onClick={() => handleDelete(rowData.id)}
                    disabled={loadingId === rowData.id}
                    title="Delete"
                >
                    {loadingId === rowData.id ? (
                        <FaSpinner className="animate-spin" />
                    ) : (
                        <FaTrash />
                    )}
                </button>
            )}
        </div>
    );

    const subcategoryActionBodyTemplate = (subcategory) => (
        <div className="actions flex gap-2">
            {buttons.includes('edit') && (
                <button
                    className="bg-gray-500 text-white px-2 py-2 rounded flex items-center justify-center"
                    onClick={() => onEdit(subcategory)}
                    title="Edit"
                >
                    <FaEdit />
                </button>
            )}
            <button
                className="bg-red-800 text-white px-2 py-2 rounded flex items-center justify-center"
                onClick={() => handleDelete(subcategory.id)}
                disabled={loadingId === subcategory.id}
                title="Delete"
            >
                {loadingId === subcategory.id ? (
                    <FaSpinner className="animate-spin" />
                ) : (
                    <FaTrash />
                )}
            </button>
        </div>
    );

    return (
        <div className="card">
            <h2 className="font-bold text-2xl my-2 capitalize">{title}</h2>
            <DataTable
                value={products}
                dataKey="id"
                tableStyle={{ minWidth: '40rem' }}
            >
                <Column field="name" header="Sector Name" />
                <Column
                    field="subcategories"
                    header="Subcategories"
                    body={(rowData) => (
                        <div>
                            {rowData.subcategories?.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="flex justify-between items-center gap-2 space-y-1"
                                >
                                    <span>{sub.name}</span>
                                    {title === 'Manage SubSectors' &&
                                        subcategoryActionBodyTemplate(sub)}
                                </div>
                            ))}
                        </div>
                    )}
                />
                {title !== 'Overview' && title !== 'Manage SubSectors' && (
                    <Column header="Actions" body={actionBodyTemplate} />
                )}
            </DataTable>
        </div>
    );
};

export default SectorTable;
