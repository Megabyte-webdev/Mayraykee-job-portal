import React, { useState, useEffect } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import CurrencyTable from './currencyTable';
import CurrencyDetails from './CurrencyDetails';
import UseAdminManagement from '../../../../hooks/useAdminManagement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { countries } from 'country-data';
export default function Currency() {

    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrencies, setSelectedCurrencies] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const { getCurrencies, deleteCurrencyById } = UseAdminManagement();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCurrencies();
                if (data) {
                    // Map through currencies and find the corresponding country
                    const updatedData = data.map((currency) => {
                        const countryEntry = Object.values(countries).find(
                            (c) => c.alpha2 === currency.name || c.alpha3 === currency.name
                        );

                        return {
                            ...currency,
                            name: countryEntry ? `${countryEntry.name} (${currency.name})` : currency.name,
                        };
                    });
                    setCurrencies(updatedData);
                } else {
                    console.error("No data received");
                }
            } catch (error) {
                console.error("Error fetching currency data:", error);
            }
        };
        fetchData();
    }, []);

    const items = [
        { label: 'Overview', icon: 'pi pi-list' },
        { label: 'Manage Currency', icon: 'pi pi-list' },
    ];

    const handleAddCurrency = () => {
        navigate('/admin/settings/currency/add');
    };

    const handleDelete = async (id) => {
        try {
            await deleteCurrencyById(id);
            toast.success('Currency deleted successfully');
            const data = await getCurrencies();
            setCurrencies(data);
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="card px-2">
            <div className='px-8 py-5'>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
                >
                    <FaArrowLeftLong className="me-4 text-green-500" />Back
                </button>
            </div>
            <ToastContainer />
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-center md:text-left">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Currency Management</h1>
                <button onClick={handleAddCurrency} className="bg-green-700 px-4 py-2 text-white rounded-md flex items-center justify-center">
                    <FaPlus className="mr-2" /> Add Currency
                </button>
            </div>
            <div className="w-full md:w-auto">
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
            </div>
            {activeIndex === 0 && (
                <CurrencyTable
                    title="Overview"
                    currencies={currencies}
                    selectedCurrencies={selectedCurrencies}
                    setSelectedCurrencies={setSelectedCurrencies}
                    onDelete={handleDelete}
                />
            )}
            {activeIndex === 1 && (
                <CurrencyTable
                    title="Manage Currency"
                    currencies={currencies}
                    selectedCurrencies={selectedCurrencies}
                    setSelectedCurrencies={setSelectedCurrencies}
                    onDelete={handleDelete}
                />
            )}
            {activeIndex === 2 && (
                <CurrencyDetails selectedCurrency={selectedCurrencies ? selectedCurrencies[0] : null} buttons={['edit', 'delete', 'view', 'download']} />
            )}
        </div>
    );
}