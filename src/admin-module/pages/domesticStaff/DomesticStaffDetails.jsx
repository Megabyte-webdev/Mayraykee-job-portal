import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { FaArrowLeftLong } from "react-icons/fa6";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import PoliceReportDialog from "../../components/Dialog/PoliceReportDialogue";
import MedicalReportDialog from "../../components/Dialog/MedicalReportDialogue";
import GuarantorReportDialog from "../../components/Dialog/GuarantorReport";
import PreviousWorkExperienceDialog from "../../components/Dialog/PreviousWorkExperienceDialogue";
import ResidentDialog from "../../components/Dialog/ResidentDialogue";

const DomesticStaffDetails = () => {
  const { id } = useParams();
  const { loading, getStaffById, getStaffReportById } = UseAdminManagement();
  const [artisan, setArtisan] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getStaffById(id);
      if (data) {
        setArtisan(data);
      } else {
        console.error("No data received");
      }
    })();
  }, [id]);


  //  if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <h1 className="font-semibold">Loading...</h1>
  //     </div>
  //   );
  // }

  const fetchReport = async (type, id) => {
    const data = await getStaffReportById(type, id);
    return data;
  };

  if (!artisan) {
    return <div>Domestic Staff not found</div>;
  }

  const { data } = artisan;

  return (
    <div className="py-4">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
      >
        <FaArrowLeftLong className="me-4 text-green-500" />Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="shadow-lg px-4 py-4 md:col-span-1">
          <div className="flex space-x-4">
            <div className="">
              {data?.profile_image ? (
                <img
                  src={"https://dash.mayrahkeeafrica.com/" + data?.profile_image}
                  alt="Profile"
                  className="h-20 w-20 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <span>No Image</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-gray-800 text-2xl font-bold mb-2">{data?.name}</h2>
              <h1 className="text-gray-400 text-sm">
                <a href={`mailto:${data?.email}`} className="text-gray-400 hover:underline">
                  {data?.email}
                </a>
              </h1>
            </div>
          </div>

          <div className="bg-gray-200 px-4 py-4 my-4">
            <div className="flex text-xs justify-between pb-3">
              <p className="font-bold">Member Since</p>  <p>{data?.member_since}</p>
            </div>
            <div className="flex">
              <p className="text-sm font-bold">Current Salary:</p> <p className="text-sm ml-2">{data?.current_salary}</p>
            </div>
            <div className="flex">
              <p className="text-sm font-bold">Expected Salary:</p> <p className="text-sm ml-2">{data?.expected_salary}</p>
            </div>
          </div>
          <hr />
          <div className="text-md px-4 py-4">
            <h1 className="font-bold">Contact</h1>
            <div className="flex items-center space-x-2">
              <span className="font-bold">Phone Number:</span> <span>{data?.phone_number}</span>
            </div>
          </div>
        </div>

        <div className="shadow-lg px-4 py-4 md:col-span-1.5">
          <div className="pb-4">
            <h1 className="font-bold">Details</h1>
            <div className="text-sm px-4 py-4 grid grid-cols-2 gap-2">
              <p className="text-sm font-bold">Staff Category:</p> <p className="text-sm">{data?.staff_category}</p>
              <p className="text-sm font-bold">Subcategory:</p> <p className="text-sm">{data?.subcategory}</p>
              <p className="text-sm font-bold">Employment Type:</p> <p className="text-sm">{data?.employment_type}</p>
              <p className="text-sm font-bold">Work Type:</p> <p className="text-sm">{data?.work_type}</p>
              <p className="text-sm font-bold">Work Days:</p> <p className="text-sm">{data?.work_days}</p>
              <p className="text-sm font-bold">Religion:</p> <p className="text-sm">{data?.religion}</p>
              <p className="text-sm font-bold">Location:</p> <p className="text-sm">{data?.location}</p>
              <p className="text-sm font-bold">Job Type:</p> <p className="text-sm">{data?.job_type}</p>
              <p className="text-sm font-bold">Years of Experience:</p> <p className="text-sm">{data?.years_of_experience}</p>
              <p className="text-sm font-bold">Education Level:</p> <p className="text-sm">{data?.education_level}</p>
              <p className="text-sm font-bold">Marital Status:</p> <p className="text-sm">{data?.marital_status}</p>
              <p className="text-sm font-bold">Languages Spoken:</p> <p className="text-sm">{data?.languages_spoken?.join(", ")}</p>
              <p className="text-sm font-bold">Status:</p> <p className="text-sm">{data?.status}</p>
            </div>
          </div>
          <hr />

        </div>

        <div className="shadow-lg px-4 py-4 md:col-span-2">
          <div className="shadow-lg px-4 py-4 md:col-span-2">
            <h1 className="font-bold py-4">Reports</h1>
            <div className="text-sm px-4 py-4 mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <PoliceReportDialog fetchData={() => fetchReport("police-report", data?.id)} />
              <MedicalReportDialog fetchData={() => fetchReport("medical-history", data?.id)} />
              <GuarantorReportDialog fetchData={() => fetchReport("guarantor", data?.id)} />
              <PreviousWorkExperienceDialog fetchData={() => fetchReport("previous-work-experience", data?.id)} />
              <ResidentDialog fetchData={() => fetchReport("residential-status", data?.id)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomesticStaffDetails;