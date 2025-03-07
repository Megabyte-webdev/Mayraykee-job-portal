import React, { useContext, useEffect, useState } from "react";
import mainLogo from "../../assets/svgs/main-logo.svg";
import mainLogoTwo from "../../assets/pngs/main-logo-icon.png";
import useCompanyProfile from "../../hooks/useCompanyProfile";
import { resourceUrl } from "../../services/axios-client";
import { MdClose } from "react-icons/md";
import wheelIcon from "../../assets/pngs/wheel-icon-black.png";

function SideBar({
  children,
  authDetails,
  companyHookProps,
  toogleIsOpen,
  isMenuOpen,
}) {
  const { details } = useCompanyProfile();
  const [greenSectionHeight, setGreenSectionHeight] = useState(160); // Default height in pixels

  useEffect(() => {
    // Dynamically calculate the height of the green section
    const updateGreenSectionHeight = () => {
      const greenSection = document.querySelector(".green-section");
      if (greenSection) {
        setGreenSectionHeight(greenSection.offsetHeight);
      }
    };

    updateGreenSectionHeight();
    window.addEventListener("resize", updateGreenSectionHeight);
    return () => window.removeEventListener("resize", updateGreenSectionHeight);
  }, []);

  const getImageURL = (image) => {
    if (typeof image === "string") {
      return `${resourceUrl}/${image}`;
    } else {
      const generatedUrl = URL.createObjectURL(image);
      return generatedUrl;
    }
  };

  return (
    <>
      {/* Main Sidebar */}
      <aside className="max-w-[220px] hidden relative min-h-screen bg-secondaryColor px-2 pb-2 md:flex flex-col">
        {/* Logo */}
        <img src={mainLogoTwo} className="w-[80%] mb-4" alt="Logo" />

        {/* Navigation */}
        <nav
          className="flex flex-col gap-[20px] divide-y-2 overflow-y-auto"
          style={{
            maxHeight: `calc(100vh - ${160}px)`, // Adjust maxHeight based on green section height
          }}
        >
          {children[0]}
          <div className="flex flex-col gap-[5px]">
            <h3 className="px-2 text-primary text-sm mt-[10px] font-semibold">More</h3>
            {children[1]}
          </div>
        </nav>

        {/* Decorative Green Slide */}
        <div
          className="absolute bottom-0 left-0 w-full green-section overflow-hidden"
          style={{ height: `${160}px` }}
        >
          <div className="w-[500px] h-full relative bg-primaryColor transform -rotate-12 origin-bottom-right" />
        </div>

        {/* User Info Section */}
        <div className="absolute bottom-0 left-0 p-2 flex gap-[5px] items-end w-[220px]">
          <div className="flex-1 flex-col flex truncate">
            <span className="text-secondaryColor text-sm font-semibold truncate">{authDetails?.user?.name || "N/A"}</span>
            <span className="text-gray-300 text-xs truncate">{authDetails?.user?.email}</span>
          </div>
          <img
            src={details?.logo_image ? getImageURL(details?.logo_image) : "https://via.placeholder.com/150"}
            className="flex-shrink-0 h-[60px] w-[60px] rounded-full bg-secondaryColor max-[1200px]:mt-[-30px] transition-all duration-500 object-cover"
            alt="User"
          />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`h-screen overflow-hidden ${
          isMenuOpen ? "left-0" : "left-[-100%]"
        } w-[300px] absolute z-[999] h-screen items-center bg-secondaryColor px-2 pb-2 flex flex-col`}
      >
        <div className="flex items-center gap-[10px]">
          <MdClose onClick={toogleIsOpen} className="text-primarycolor text-3xl" />
          <img src={mainLogoTwo} className="w-[60%]" alt="Logo" />
        </div>

        <nav
          className="h-[90%] overflow-y-auto w-full flex flex-col justify-start gap-[20px] divide-y-2"
          style={{
            maxHeight: `calc(100vh - ${160}px)`, // Adjust maxHeight based on green section height
          }}
        >
          {children[0]}
          <div className="flex flex-col gap-[5px]">
            <h3 className="px-2 text-primary text-sm mt-[10px] font-semibold">Personalise</h3>
            {children[1]}
          </div>
        </nav>

              {/* Decorative Green Slide */}
        <div
          className="absolute bottom-0 left-0 w-full green-section overflow-hidden"
          style={{ height: `${160}px` }}
        >
          <div className="w-[500px] h-full relative bg-primaryColor transform -rotate-12 origin-bottom-right" />
        </div>

        {/* User Info Section */}
        <div className="absolute bottom-0 left-0 p-2 flex gap-[5px] items-end w-[280px]">
          <div className="flex-1 flex-col flex truncate">
            <span className="text-secondaryColor text-sm font-semibold truncate">{authDetails?.user?.name || "N/A"}</span>
            <span className="text-gray-300 text-xs truncate">{authDetails?.user?.email}</span>
          </div>
          <img
            src={details?.logo_image ? getImageURL(details?.logo_image) : "https://via.placeholder.com/150"}
            className="flex-shrink-0 h-[60px] w-[60px] rounded-full bg-secondaryColor max-[1200px]:mt-[-30px] transition-all duration-500 object-cover"
            alt="User"
          />
        </div>
      </aside>
    </>
  );
}

export default React.memo(SideBar);
