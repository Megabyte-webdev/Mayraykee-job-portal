import React, { useState, useEffect } from "react";
import { FaSpinner, FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import { convertDays } from "../../../../utils/constants";

export default function SubscriptionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    number_of_jobs: "", 
    number_of_candidates: "",
    permissions: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPerk = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [...prev.permissions, ""],
    }));
  };

  const handlePerkChange = (index, value) => {
    const updatedPerks = [...formData.permissions];
    updatedPerks[index] = value;
    setFormData((prev) => ({ ...prev, permissions: updatedPerks }));
  };

  const handleRemovePerk = (index) => {
    const updatedPerks = formData.permissions.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, permissions: updatedPerks }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-96 lg:w-[600px] h-[90%] overflow-x-auto md:w-md rounded-md shadow-md pb-6 px-6 relative">
        <div className="bg-white sticky top-0 right-4 flex gap-2 pt-6 justify-between items-center">
          <h2 className="text-lg font-bold mb-4">
            {initialData ? "Edit Package" : "Add Package"}
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-800"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              min={0}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Duration (Days)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min={1}
              className="w-full px-3 py-2 border rounded-md"
            />
            <small className="text-xs text-green-700 font-medium p-3">{convertDays(formData.duration)}</small>
          </div>
          <div>
            <label className="block font-medium mb-1">Number of Jobs</label>
            <input
              type="number"
              name="number_of_jobs"
              value={formData.number_of_jobs}
              min={1}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Number of Applicants</label>
            <input
              type="number"
              name="number_of_candidates"
              value={formData.number_of_candidates}
              min={1}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Perks</label>
            {formData.permissions.map((perk, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={perk}
                  onChange={(e) => handlePerkChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder="Enter a perk"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemovePerk(index)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPerk}
              className="flex items-center gap-2 text-green-600 mt-2"
            >
              <FaPlus />
              Add Perk
            </button>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
