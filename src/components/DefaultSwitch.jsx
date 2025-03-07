import React from "react";
import { FaSpinner } from "react-icons/fa";

function DefaultSwitch({ enabled, setEnabled, onClick, loading }) {
  return (
    <div
      className={`flex items-center justify-center ${loading ? "cursor-wait" : "cursor-pointer"}`}
      onClick={!loading ? onClick : undefined}
    >
      {loading ? (
        <div className="flex justify-center items-center w-10 h-5 bg-gray-300 rounded-full">
          <FaSpinner className="text-green-500 animate-spin" size="20" />
        </div>
      ) : (
        <div
          className={`relative w-10 h-5 bg-gray-300 rounded-full ${
            enabled ? "bg-green-400" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform ${
              enabled ? "translate-x-5" : "translate-x-0"
            } transition-transform`}
          />
        </div>
      )}
    </div>
  );
}

export default DefaultSwitch;
