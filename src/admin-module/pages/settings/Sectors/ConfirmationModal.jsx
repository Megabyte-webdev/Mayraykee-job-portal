import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-80 rounded-md shadow-md p-6">
        <p className="text-left mb-6 text-gray-700 font-medium">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
