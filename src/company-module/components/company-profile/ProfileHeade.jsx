import wheelIcon from "../../../assets/pngs/wheel-icon-black.png";
import { FaRegEdit } from "react-icons/fa";
import { resourceUrl } from "../../../services/axios-client";

function ProfileHeader({ children, isOpen, setIsOpen, details }) {
  const getImageURL = (image) => {
   

    if (typeof image === "string") {
      return `${resourceUrl}/${image}`
     
    } else {
      const generatedUrl = URL.createObjectURL(image);
      return generatedUrl
    }
  };

  return (
    <div className="w-full h-auto border flex flex-col lg:flex-row items-center lg:items-start">
      {/* Profile Image Section */}
      <div className="flex-shrink-0 w-full md:w-fit flex items-center justify-center relative p-4 md:my-2">
        <img
          className="h-[80px] w-[80px] rounded-full object-cover border-2"
          src={details?.logo_image ? `${resourceUrl}/${details?.logo_image}` : wheelIcon}
          alt="Profile"
        />
      </div>

      {/* Right-hand Section */}
      <div className="flex flex-col h-full justify-between w-full md:w-[90%] p-4">
        {/* Top Section (Company Info) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-4">
          <div className="text-gray-800 space-y-1 md:space-y-0">
            <h2 className="font-bold text-2xl md:text-3xl">{details?.company_name}</h2>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span>Email:</span>
                <a href={`mailto:${details?.email}`} className="hover:underline break-all">{details?.email}</a>
              </span>
              <hr className="hidden md:block w-px h-6 bg-gray-300" />
              <span className="flex items-center gap-1">
                <span>Phone:</span>
                <a href={`tel:${details?.phone_number}`} className="hover:underline">{details?.phone_number}</a>
              </span>
            </div>

            <span className="flex items-center gap-1 text-sm">
              <span>Profile URL:</span>
              <a href={details?.profile_url} className="hover:underline break-all" target="_blank" rel="noopener noreferrer">
                {details?.profile_url}
              </a>
            </span>
          </div>

          {/* Update Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 md:mt-0 text-primaryColor border border-primaryColor py-1 px-2 text-sm rounded"
          >
            Update Details
          </button>
        </div>

        {/* Attributes Section */}
        <ul className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 p-4 border-t border-gray-200">
          {children}
        </ul>
      </div>
    </div>
  );
}

export default ProfileHeader;
