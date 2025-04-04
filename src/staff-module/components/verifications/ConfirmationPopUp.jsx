import { useEffect } from "react";

const ConfirmationPopUp = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-96 max-w-sm transform scale-100 transition-transform duration-300">
        <h2 className="text-xl font-semibold text-gray-900">Confirm Your Details</h2>
        <p className="text-gray-700 mt-2">{message}</p>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-100 focus:ring focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-green-600 rounded-lg transition-all duration-200 hover:bg-green-700 focus:ring focus:ring-green-300"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopUp;
