import React from "react";
import PropTypes from "prop-types";
import { FaUserCircle } from "react-icons/fa";
import { resourceUrl } from "../services/axios-client";

const StaffCard = ({ staff }) => {
  return (
    <div
      className="w-full bg-white border border-gray-200 rounded-lg shadow-md p-5 transition hover:shadow-xl">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-4">
        {staff.profile_image ? (
          <img
            src={`${resourceUrl}${staff?.profile_image}`}
            alt={`${staff?.first_name} ${staff?.surname}`}
            className="w-20 h-20 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <FaUserCircle className="w-20 h-20 text-gray-400" />
        )}

        <div>
          <h3 className="font-semibold text-xl text-gray-900">
            {staff?.first_name} {staff?.middle_name} {staff?.surname}
          </h3>
          <p className="text-sm text-gray-600">{staff?.subcategory}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="text-sm text-gray-800 space-y-2">
        <p>
          <span className="font-medium text-gray-700">Age:</span> {staff?.age || "N/A"}
        </p>
        <p>
          <span className="font-medium text-gray-700">Gender:</span> {staff?.gender || "N/A"}
        </p>
        <p>
          <span className="font-medium text-gray-700">Location:</span> {staff?.location || "N/A"}
        </p>
        <p>
          <span className="font-medium text-gray-700">Experience:</span>{" "}
          {`${staff?.years_of_experience} years` || "N/A"} 
        </p>
      </div>

      {/* Employment Details */}
      <div className="mt-4 text-sm text-gray-600 space-y-2">
        <p>
          <span className="font-medium text-gray-700">Employment Type:</span> {staff?.employment_type || "N/A"}
        </p>
      
        <p>
          <span className="font-medium text-gray-700">Languages Spoken:</span>{" "}
          {staff?.languages_spoken?.length
            ? staff?.languages_spoken.join(", ")
            : "N/A"}
        </p>
      </div>

      {/* Additional Information */}
      <div className="mt-4 text-sm text-gray-600 space-y-2">
        <p>
          <span className="font-medium text-gray-700">Religion:</span> {staff.religion || "N/A"}
        </p>
      </div>
    </div>
  );
};

StaffCard.propTypes = {
  staff: PropTypes.shape({
    first_name: PropTypes.string,
    middle_name: PropTypes.string,
    surname: PropTypes.string,
    profile_image: PropTypes.string,
    subcategory: PropTypes.string,
    age: PropTypes.string,
    gender: PropTypes.string,
    location: PropTypes.string,
    years_of_experience: PropTypes.string,
    employment_type: PropTypes.string,
    languages_spoken: PropTypes.arrayOf(PropTypes.string),
    religion: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default StaffCard;
