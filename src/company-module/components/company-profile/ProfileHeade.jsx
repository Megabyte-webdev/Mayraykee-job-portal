import wheelIcon from "../../../assets/pngs/wheel-icon-black.png";
import { FaRegEdit } from "react-icons/fa";
import { resourceUrl } from "../../../services/axios-client";

function ProfileHeader({ children, isOpen, setIsOpen, details }) {
  const getImageURL = (e, setStateFunctionUrl) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const generatedUrl = URL.createObjectURL(file);
      setStateFunctionUrl(generatedUrl);
    } else {
      alert("Please select a valid JPEG or PNG file.");
    }
  };

  console.log(`${resourceUrl}/${details?.logo_image}`);

  return (
    <div className="w-full h-auto border flex flex-col md:flex-row items-center md:items-start">
      {/* Profile Image Section */}
      <div className="w-full md:w-fit flex items-center justify-center relative p-4 md:my-2">
        <img
          className="h-[80px] w-[80px] rounded-full object-cover border-2"
          src={details?.logo_image ? `${resourceUrl}${details?.logo_image}` : wheelIcon}
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
                <a href={`mailto:${details?.email}`} className="hover:underline">{details?.email}</a>
              </span>
              <hr className="hidden md:block w-px h-6 bg-gray-300" />
              <span className="flex items-center gap-1">
                <span>Phone:</span>
                <a href={`tel:${details?.phone_number}`} className="hover:underline">{details?.phone_number}</a>
              </span>
            </div>

            <span className="flex items-center gap-1 text-sm">
              <span>Profile URL:</span>
              <a href={details?.profile_url} className="hover:underline" target="_blank" rel="noopener noreferrer">
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
        <ul className="flex flex-wrap w-full gap-4 p-4 border-t border-gray-200">
          {children}
        </ul>
      </div>
    </div>
  );
}

export default ProfileHeader;
