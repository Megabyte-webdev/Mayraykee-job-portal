import React from "react";
import { FaSpinner } from "react-icons/fa"; // Importing the spinner icon

export default function ToggleSwitch({ isOn, onToggle, isLoading=false }) {
  return (
    <div
      className={`relative w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-150 ${
        isOn ? "bg-green-500" : "bg-gray-400"
      }`}
      onClick={!isLoading ? onToggle : undefined} // Disable toggle click while loading
    >
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-150 ${
          isOn ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FaSpinner className="animate-spin text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
}
