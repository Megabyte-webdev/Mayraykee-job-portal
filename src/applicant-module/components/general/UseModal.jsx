import { IoMdCloseCircle } from "react-icons/io";
import {
    FaRegEdit,
    FaFacebook,
    FaLinkedin,
    FaTwitter,
    FaInstagram,
} from "react-icons/fa";
import { useEffect, useState } from "react";

function UseModal({ isOpen, setIsOpen, header, user, children }) {
    return (
        isOpen && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-600/70 text-gray-400">
                <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] max-h-[90vh] p-4 bg-white border rounded-lg overflow-y-auto thin_scroll_bar">
                    <IoMdCloseCircle
                    size="24"
                        onClick={() => setIsOpen(false)}
                        className="sticky z-10 top-3 self-end text-lg text-red-600 mb-5 cursor-pointer"
                    />
                    <div className="flex flex-col gap-4 px-2">
                        <h3 className="pb-2 text-lg font-semibold text-gray-600 border-b">{header}</h3>
                        {children}
                    </div>
                </div>
            </div>
        )
    );
}

export default UseModal;
