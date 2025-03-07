import React, { useState } from "react";
import mainLogoTwo from "../../assets/pngs/main-logo-icon.png";
import { MdClose } from "react-icons/md";
import { ResourceContext } from "../../context/ResourceContext";
import { IMAGE_URL } from "../../utils/base";

function SideBar({ children, authDetails, toogleIsOpen, isMenuOpen }) {
  const imgUrl=authDetails?.user?.profile_image
  const [greenSectionHeight, setGreenSectionHeight] = useState(160); // Default height in pixels
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="max-w-[220px] hidden relative h-screen bg-secondaryColor px-2 pb-2 md:flex flex-col">
        {/* Logo */}
        <img src={mainLogoTwo} className="w-[80%] mb-4" alt="Logo" />

        {/* Navigation */}
        <nav
          className="flex flex-col gap-[20px] divide-y-2 overflow-y-auto"
          style={{
            maxHeight: `calc(100vh - ${greenSectionHeight + 10}px)`,
          }}
        >
          {children[0]}
          <div className="flex flex-col gap-[5px]">
            <h3 className="px-2 text-primary text-sm mt-[10px] font-semibold">
              More
            </h3>
            {children[1]}
          </div>
        </nav>

        {/* Green Slide */}
        <div
          className="absolute bottom-0 left-0 w-full green-section overflow-hidden"
          style={{ height: `${160}px` }}
        >
          <div className="w-[500px] h-full bg-primaryColor transform -rotate-12 origin-bottom-right" />
        </div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 p-2 flex gap-[5px] items-end w-full">
          <div className="flex-1 flex flex-col truncate">
            <span className="text-secondaryColor text-sm truncate">
              {`${authDetails?.user?.first_name || "N/A"} ${
                authDetails?.user?.surname || "N/A"
              }`}
            </span>
            <span className="text-gray-300 text-[11px] truncate">
              {authDetails?.user?.email || "N/A"}
            </span>
          </div>
          <img
            src={
              imgUrl
                ? `${IMAGE_URL}/${imgUrl}`
                : "https://via.placeholder.com/150"
            }
            className="h-[60px] w-[60px] rounded-full bg-secondaryColor object-cover"
            alt="User"
          />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`h-screen ${
          isMenuOpen ? "left-0" : "left-[-100%]"
        } w-[300px] absolute z-[999] h-screen bg-secondaryColor px-2 pb-2 flex flex-col overflow-hidden`}
      >
        {/* Close Button and Logo */}
        <div className="flex items-center gap-[10px]">
          <MdClose
            onClick={toogleIsOpen}
            className="text-primarycolor text-3xl cursor-pointer"
          />
          <img src={mainLogoTwo} className="w-[60%]" alt="Logo" />
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 w-full flex flex-col gap-[20px] divide-y-2 overflow-y-auto mt-4"
          style={{
            maxHeight: `calc(100vh - ${160}px)`,
          }}
        >
          {children[0]}
          <div className="flex flex-col gap-[5px]">
            <h3 className="px-2 text-primary text-sm mt-[10px] font-semibold">
              More
            </h3>
            {children[1]}
          </div>
        </nav>

        {/* Green Slide */}
        <div
          className="absolute bottom-0 left-0 w-full green-section"
          style={{ height: `${120}px` }}
        >
          <div className="w-[120%] h-full bg-primaryColor transform -rotate-12 origin-bottom-right" />
        </div>

        {/* User Info */}
        <div className="absolute bottom-0 right-3 p-2 flex gap-3 items-end">
          <div className="flex flex-col truncate">
            <span className="text-secondaryColor text-sm truncate">
              {`${authDetails?.user?.first_name || "N/A"} ${
                authDetails?.user?.surname || "N/A"
              }`}
            </span>
            <span className="text-gray-300 text-[11px] truncate">
              {authDetails?.user?.email || "N/A"}
            </span>
          </div>
          <img
            src={
              imgUrl
                ? `${IMAGE_URL}/${imgUrl}`
                : "https://via.placeholder.com/150"
            }
            className="h-[70px] w-[70px] rounded-full bg-primaryColor object-cover"
            alt="User"
          />
        </div>
      </aside>
    </>
  );
}

export default React.memo(SideBar);
