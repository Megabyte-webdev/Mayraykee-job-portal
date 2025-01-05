import React from "react";

function DefaultSwitch({ enabled, setEnabled, onClick, loading }) {
  return (
    <div
      className={`flex items-center justify-center ${
        loading ? "cursor-wait" : "cursor-pointer"
      }`}
      onClick={!loading ? onClick : undefined}
    >
      {loading ? (
        <div className="loader h-5 w-5 border-2 border-blue-500 rounded-full animate-spin" />
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
