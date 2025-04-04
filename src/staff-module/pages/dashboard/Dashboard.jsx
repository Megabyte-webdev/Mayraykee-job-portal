import { Helmet } from "react-helmet";
import docsIcon from "../../../assets/pngs/doc-vector.png";
import chatsIcon from "../../../assets/pngs/multiple-chat.png";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlineRateReview,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { RiCalendarEventLine } from "react-icons/ri";
import { generateDateRange, parseHtml } from "../../../utils/formmaters";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContex";
import { StaffRouteContext } from "../../../context/StaffRouteContext";
import { useNavigate } from "react-router-dom";
import { StaffManagementContext } from "../../../context/StaffManagementModule";
import DefaultSwitch from "../../../components/DefaultSwitch";
import useStaffUser from "../../../hooks/useStaffUser";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { axiosClient } from "../../../services/axios-client";
import { GrDocumentText, GrUpload } from "react-icons/gr";



function Dashboard() {
  const { authDetails } = useContext(AuthContext);
  const { setSideBar } = useContext(StaffRouteContext);
  const { profileDetails, getStaffProfile } = useContext(
    StaffManagementContext
  );
  const client = axiosClient(authDetails.token);

  const [availablityStatus, setAvailabiltyStatus] = useState();
  const [loading, setloading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [category, setCategory] = useState([]);
  const { updateAvailabilityStatus, getStyling, allStatus } = useStaffUser();

  useEffect(()=>{
    getStaffProfile()
  },[])
  const filterVerificationDetails =
    profileDetails &&
    Object.keys(profileDetails).filter(
      (currentKey) =>
        currentKey == "guarantor_verification_status" ||
        currentKey == "residence_verification_status" ||
        currentKey == "medical_history_verification_status" ||
        currentKey == "police_report_verification_status" ||
        currentKey == "previous_employer_verification_status"
    );

    const userVerificationStatus=filterVerificationDetails?.map((currentKey) => (
      allStatus.find(
       (current) => current === profileDetails[currentKey]
     )))?.filter(status=> status==="approved")


  const navigate = useNavigate();
  const navigateToPage = (route, index) => {
    navigate(route);
    setSideBar(index);
  };


  useEffect(() => {
    const initData = async () => {
      try {
        const { data } = await client.get("/staff-categories");
        const sub = data.data?.find(one => one.name.toLowerCase().includes(profileDetails?.staff_category))?.subcategories || []
        const cat = sub?.find(one => one.name === profileDetails?.subcategory)
        setCategory(cat);
      } catch (error) {
        onFailure({
          message: "Duties Error",
          error: "Failed to retrieve duties",
        });
      }
    };

    initData();
  }, [profileDetails])
  useEffect(() => {
    if (profileDetails && profileDetails["availability_status"] === "1") {
      setAvailabiltyStatus(true);
    } else {
      setAvailabiltyStatus(false);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | Dashboard</title>
      </Helmet>
      <div className="h-full p-6 w-full text-sm text-gray-800">
        <div className="text-sm">
          <div className="flex justify-between ">
            <div className="">
              <h4 className="font-bold text-2xl mb-2  ">
                Welcome back, {authDetails?.user?.first_name}{" "}
                {authDetails?.user?.surname}
              </h4>
              <p>
                Here is a summary of your recent activities {generateDateRange()}
              </p>
            </div>
            {/* <div>
              <button className="border p-2 hidden md:flex items-center">
                {" "}
                {generateDateRange()}
                <RiCalendarEventLine className="ml-2 " size={15} />
              </button>
            </div> */}
          </div>
          <div className="md:flex-row flex-col flex justify-between  mt-8 gap-2">
            <div className=" w-full md:w-[23%]  flex justify-between md:flex-col ">
              <div className="pb-1 min-h-24 md:w-full w-[45%] md:h-1/2">
                <div
                  onClick={() => navigateToPage("/staff/profile", 1)}
                  className="border text-white transition duration-400 bg-lightgreen h-full cursor-pointer mb-4 p-3 pb-0 flex flex-col justify-between"
                >
                  <p className="font-bold">Profile Update</p>
                  <p className="pl-2 text-xl font-bold break-all">{profileDetails?.profile_image ? "Completed" : "Pending"}</p>
                  <div className="flex justify-between items-end mt-">
                    <p className="text-2xl font-medium"></p>
                    <div className="text-gray-300 mb-1">
                      <GrDocumentText size="30" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-1 min-h-24 md:w-full w-[45%]  md:h-1/2">
                <div
                  onClick={() => navigateToPage("/staff/resume", 2)}
                  className="border bg-darkblue text-white transition duration-400 h-full cursor-pointer mb-4 p-3 pb-0 flex flex-col justify-between"
                >
                  <p className="font-bold">Resume</p>
                  <p className="pl-2 text-xl font-bold">{profileDetails?.resume ? "Uploaded" : "Pending"}</p>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-6xl font-medium"></p>
                    <div className="text-gray-300 mb-1">
                      <GrUpload size="30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" w-full md:w-[23%]  flex justify-between md:flex-col ">
              <div className="pt-1 min-h-24 md:w-full w-[45%]  md:h-1/2">
                <div
                  onClick={() => navigateToPage("/staff/verifications", 2)}
                  className="border  bg-lightorange text-white transition duration-400 h-full cursor-pointer mb-4 p-3 pb-0 flex flex-col justify-between"
                >
                  <p className="font-bold">Verification Status</p>
                  <p className="pl-2 text-xl font-bold">{userVerificationStatus?.length > 4 ? "Completed" : userVerificationStatus?.length > 0 ? "In Progress" : "Pending"}</p>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text- font-medium"></p>
                    <div className=" text-gray-300">
                      <MdOutlineRateReview size={30} />
                      {/* <img src={docsIcon} alt="" className="w-10" /> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-1 min-h-24 md:w-full w-[45%]  md:h-1/2">
                <div
                  onClick={() => navigateToPage("/staff/help-center", 5)}
                  className="border bg-lightblue text-white transition duration-400 h-full cursor-pointer mb-4 p-3 pb-0 flex flex-col justify-between"
                >
                  <p className="font-bold">Help Center</p>
                  <p className="pl-2 text-xl font-bold">Get Help</p>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-6xl font-medium"></p>
                    <div className=" text-gray-300">
                      <MdOutlineRemoveRedEye size={30} />
                      {/* <img src={chatsIcon} alt="" className="w-[60px]" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[50%] font-medium border py-3 text-sm">
              <div className="px-3 border-b">
                <p className="font-bold my-3">Records Status</p>
              </div>
              <div className="px-3 flex flex-col border-b justify-between items-start">
                {filterVerificationDetails?.map((currentKey) => {
                  const detail =
                    allStatus.find(
                      (current) => current === profileDetails[currentKey]
                    ) || "Not Recorded";
                  const labelText = currentKey.replace(/_/g, " ").toLowerCase();

                  return (
                    <div
                      onClick={() => navigateToPage("/staff/verifications", 2)}
                      className="p-2 cursor-pointer hover:bg-gray-100 flex justify-between gap-2 w-full"
                    >
                      <span className="capitalize">{labelText}:</span>
                      <span
                        className={`${getStyling(
                          detail
                        )} text-black capitalize font-semibold"`}
                      >
                        {detail}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="my-5 min-h-80">
          <div className="border flex flex-col">
            {/* Availability Status Section */}
            <div className="p-3 flex gap-10 border-b">
              <p className="font-bold text-base">Availability Status</p>
              {(profileDetails?.status === "pending" || profileDetails?.status === "approved") ? <DefaultSwitch
                enabled={availablityStatus}
                disabled={loading}
                loading={loading}
                onClick={async () => {
                  console.log("clicked");
                  setloading(true);
                  const result = await updateAvailabilityStatus(
                    authDetails.user.id,
                    availablityStatus ? "0" : "1"
                  );
                  if (result) {
                    setAvailabiltyStatus(!availablityStatus);
                  }
                  setloading(false);
                }}
              /> : <strong className={`capitalize font-medium ${profileDetails?.status === "rejected" ? "text-red-500" : "text-brown-300"}`}>{profileDetails?.status}</strong>}
            </div>

            {/* Grid Items Section */}
            <div className="p-3 flex-1">
              <div className="my-4 flex justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 hover:opacity-90">
                  {/* Scrollable Left Grid Item */}
                  <div className="overflow-y-auto max-h-80 p-2 border">
                    {(profileDetails?.status === "pending" || profileDetails?.status === "approved") ? <p className="text-md leading-7 tracking-wider">
                      We've introduced a user-friendly feature just for you,
                      giving you the power to control your availability status
                      with a simple click.
                    </p> : <p className="text-md leading-7 tracking-wider">We appreciate your interest in our service, Unfortunately your application has been {profileDetails?.status}! If you'd like feedback on your application. please contact our support team.</p>}
                  </div>

                  {/* Scrollable Right Grid Item */}
                  <div className="border max-h-80 overflow-y-auto">
                    <strong className="text-xl sticky top-0 bg-green-700 text-white p-2 mb-4">
                      Responsibilities
                    </strong>
                    <p className="prose p-2 my-2">
                      {category?.description && parseHtml(
                        showFullDescription
                          ? category?.description
                          : category?.description?.slice(0, 100) + "..."
                      )}
                    </p>
                    {category?.description?.length > 100 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-blue-600 font-semibold mb-2 p-2"
                      >
                        {showFullDescription ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;
