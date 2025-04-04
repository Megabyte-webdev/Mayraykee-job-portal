import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContex";
import { axiosClient, resourceUrl } from "../../../services/axios-client";
import { get, set } from "idb-keyval";
import { StaffManagementContext } from "../../../context/StaffManagementModule";
import { MdAccountCircle } from "react-icons/md";

const PROFILE_DETAILS_KEY = "Staff Profile Detaials Database";

function ViewProfileDetails() {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token);
  const [loading, setLoading] = useState(false);
  const { profileDetails, getStaffProfile } = useContext(
    StaffManagementContext
  );

  const filterProfileDetails =
    profileDetails &&
    Object.keys(profileDetails).filter(
      (currentKey) =>
        currentKey === "email" ||
        currentKey === "first_name" ||
        currentKey === "surname" ||
        currentKey === "middle_name" ||
        currentKey === "gender" ||
        currentKey === "age" ||
        currentKey === "religion" ||
        currentKey === "ethnicity" ||
        currentKey === "location" ||
        currentKey === "employment_type" ||
        currentKey === "work_type" ||
        currentKey === "work_days" ||
        currentKey === "renumeration" ||
        currentKey === "current_salary" ||
        currentKey === "epected_salary" ||
        currentKey === "years_of_experience" ||
        currentKey === 'education_level' ||
        currentKey === 'languages_spoken' ||
        currentKey === 'marital_status'
    );

 return (
    <div className="w-full flex flex-col gap-10">
      <h1 className="text-xl text-green-700 font-semibold">Your Profile Information</h1>
      <figure className="h-[100px] w-[100px] rounded-full overflow-hidden bg-secondaryColor flex items-center justify-center text-gray-500 border border-[#dee2e6]">
        {!profileDetails?.profile_image ?
          <MdAccountCircle size={45} />
          :
          <img
            src={`${resourceUrl}${profileDetails?.profile_image}`}
            alt="User"
            className="h-[100px] w-[100px] rounded-full object-cover"
          />}
      </figure>
      {profileDetails ? (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 p-2 w-full text-gray-600 break-words">
            {filterProfileDetails.map((currentKey, index) => {
              const detail = profileDetails[currentKey];
              const labelText = currentKey.replace(/_/g, " ").toLowerCase();

              return (
                <div key={index} className="flex flex-col gap-1">
                  <label className="px-2 py-1 font-semibold  bg-gray-50 capitalize">{labelText}</label>
                  {currentKey !== "languages_spoken" ? <p className="px-2  text-wrap">{detail ? detail : "Pending"}</p>
                    : <div className="flex flex-wrap gap-2 px-2">
                      {detail?.map((lang, index) => (
                        <p key={index}>{lang}{index < detail.length - 1 && ', '}</p>
                      ))}
                    </div>}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <span>Loading Data</span>
      )}
    </div>
  );
}

export default ViewProfileDetails;
