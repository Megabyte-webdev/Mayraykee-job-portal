import { IoMdCloseCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import {ResourceContext} from "../../context/ResourceContext";

function NotificationsModal({ isOpen, setIsOpen, data }) {
  const { 
    notifications,
    setNotifications } = useContext(ResourceContext);
  const isValidData =
    Array.isArray(notifications) &&
    notifications.every(item => item && typeof item.message === "string" && typeof item.from === "string");

  // Function to clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]); 
  };

  // Function to remove a single notification when clicked
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setIsOpen(false);
  };

  return (
    isOpen && (
      <div className="h-full z-50 w-full text-primaryColor text-little flex justify-center items-center bg-gray-600/70 fixed top-0 left-0">
        <div className="w-80 md:w-[400px] lg:w-[600px] min-h-80 h-max max-h-[90%] p-4 pt-0 flex flex-col rounded-[10px] bg-white shadow-lg border overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 pt-2 flex justify-between items-center">
            <h4 className="text-lg font-bold text-green-800 border-b pb-2 mb-3">
              Notifications
            </h4>
            <IoMdCloseCircle
              onClick={() => setIsOpen(false)}
              className="text-2xl text-red-500 cursor-pointer hover:scale-110 transition duration-300"
            />
          </div>

          {isValidData && notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-sm text-red-600 hover:text-red-800 transition mb-3 self-end"
            >
              Clear All
            </button>
          )}

          <div className="flex flex-col w-full gap-3">
            {notifications.length === 0 ? (
              <span className="text-red-500 text-center mt-4 w-full">
                No notifications
              </span>
            ) : (
              <ul className="w-full">
                {notifications.map(notification => (
                  <li
                    key={notification.id}
                    className="p-3 mb-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 cursor-pointer"
                  >
                    <Link
                      to={notification.link || '#'}
                      onClick={() => removeNotification(notification.id)}
                      className="block"
                    >
                      <p className="text-sm text-gray-700 mb-1 font-medium">
                        {notification.message.length > 25
                          ? `${notification.message.slice(0, 25)}...`
                          : notification.message}
                      </p>
                      <span className="text-xs text-gray-500 italic">
                        From: {notification.from}
                      </span>
                      {notification.timestamp && (
                        <span className="block text-xs text-gray-400 mt-1">
                          {notification.timestamp}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default NotificationsModal;
