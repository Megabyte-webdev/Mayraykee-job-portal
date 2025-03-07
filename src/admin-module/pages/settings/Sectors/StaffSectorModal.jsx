import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Selector from '../../../../components/Selector';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const StaffSectorModal = ({ isOpen, onClose, onSubmit, initialData, loading, sectors, isSubsector = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        category_id: '', // Add category_id for subcategory
    });

    useEffect(() => {
        console.log(initialData)
        if (initialData && isSubsector) {
            setFormData({
                name: initialData?.name || '',
                description: initialData?.description || '',
                category_id: initialData?.category_id || '', // Set category_id if editing
            });
        } else {
            setFormData({
                name: initialData?.name || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.info('Name is required');
            return;
        }
        // Fix: Check the correct field `category_id` instead of `sectorId`
        if (isSubsector && !formData.category_id) {
            toast.info('Please select a category');
            return;
        }
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md mx-auto h-max max-h-[90%] rounded-lg shadow-lg p-6 overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {initialData ? `Edit ${isSubsector ? "Subsector" : "Sector"}` : `Add ${isSubsector ? "SubSector" : "Sector"}`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-red-500 hover:text-red-700 font-bold text-2xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                        {/* Show sector dropdown only when adding or editing a subsector */}
                        {isSubsector && (
                            <div>
                                <label
                                    htmlFor="category_id"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Select Category
                                </label>
                                <Selector
                                    data={sectors}
                                    selected={sectors?.find(one => one.id === formData.category_id)}
                                    setSelected={({ id }) => setFormData({ ...formData, "category_id": id })}
                                />

                            </div>
                        )}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="p-3 py-2 mt-1 block w-full border border-gray-400 shadow-sm"
                            />
                        </div>
                        {isSubsector && (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <ReactQuill
                                    placeholder="Write your content here..."
                                    value={formData.description}
                                    className="custom-quill-editor" // Custom class for styling
                                    onChange={(text) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: text, // Properly update the specific field in the object
                                        }));
                                    }
                                    }
                                />
                            </div>)
                        }


                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                            ) : null}
                            {initialData ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffSectorModal;
