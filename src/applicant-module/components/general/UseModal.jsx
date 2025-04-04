import { IoMdCloseCircle } from "react-icons/io";

function UseModal({ isOpen, setIsOpen, header, children }) {
    return (
        isOpen && (
            <div className="fixed inset-0 -left-3 w-full z-[1000000] flex items-center justify-center bg-gray-600/70 text-gray-400">
                <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] max-h-[90vh] p-4 bg-white border rounded-lg overflow-y-auto thin_scroll_bar mx-auto relative">
                    <IoMdCloseCircle
                        size="24"
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-lg text-red-600 cursor-pointer"
                    />
                    <div className="flex flex-col gap-4 px-2">
                        <h3 className="pb-2 text-lg font-semibold text-gray-600 border-b">
                            {header}
                        </h3>
                        {children}
                    </div>
                </div>
            </div>
        )
    );
}

export default UseModal;
