import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { FaArrowLeftLong, FaTwitter, FaInstagram, FaGlobe, FaLinkedin } from "react-icons/fa6";
import { MdEmail, MdPhone } from "react-icons/md";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import { format } from "date-fns";
import { BsEye, BsShieldLock } from "react-icons/bs";

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidateById } = UseAdminManagement();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getCandidateById(id);
      console.log(data.categories);
      if (data) {
        setCandidate(data);
      } else {
        console.error("No data received");
      }
    })();
  }, [id]);

  if (!candidate) {
    return <div className="px-5 py-5 font-bold ">Candidate not found</div>;
  }

  const data = candidate;

  const handleViewContract = () => {
    navigate(`/admin/candidate/${id}/staffs`);
  };

  const renderSocialMedia = (socialMediaHandles) => {
    return socialMediaHandles.map((handle, index) => {
      if (!handle.network || !handle.url) return null;

      let icon;
      let label;

      switch (handle.network.toLowerCase()) {
        case 'twitter':
          icon = <FaTwitter className="text-blue-500" />;
          label = 'Twitter';
          break;
        case 'instagram':
          icon = <FaInstagram className="text-pink-500" />;
          label = 'Instagram';
          break;
        case 'linkedin':
          icon = <FaLinkedin className="text-blue-700" />;
          label = 'LinkedIn';
          break;
        case 'website':
          icon = <FaGlobe className="text-gray-600" />;
          label = 'Website';
          break;
        default:
          return null;
      }

      return (
        <div key={index} className="flex items-center space-x-2">
          {icon}
          <a href={handle.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {label}
          </a>
          <a href={handle.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {label}
          </a>
        </div>
      );
    });
  };

  const renderNinSlip = (ninSlip) => {
    if (!ninSlip) return null;

    const isPdf = ninSlip.toLowerCase().endsWith('.pdf');
    const url = `https://dash.mayrahkeeafrica.com/${ninSlip}`;

    return isPdf ? (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
        View NIN Slip (PDF)
      </a>
    ) : (
      <img src={url} alt="NIN Slip" className="mt-2 w-40 h-40 rounded-xl" />
    );
  };

  return (
    <div className="py-4">
     <div className="flex pb-3  sm:space-x-72  space-x-0  justify-between sm:justify-start ">
     <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
        >
       <FaArrowLeftLong className="me-4 text-green-500" />Back
        </button>
      <button
          type="button"
          onClick={handleViewContract} 
          className="flex items-center gap-2  bg-green-500 px-4 py-2 rounded text-white hover:bg-green-800"
        >
      View contract
        </button>
     </div>
      {/* <Button label="View Contract" className="mb-4 ml-4" onClick={handleViewContract} /> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="shadow-lg px-4 py-4 md:col-span-1">
          <div className="flex space-x-4">
            <div className="">
              {data.profile ? (
                <img src={"https://dash.mayrahkeeafrica.com/" + data.profile} alt="Profile" className="h-20 w-20 rounded-full border-4 border-white shadow-lg" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <span>No Image</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-gray-800 text-2xl font-bold mb-2">{data.full_name.toUpperCase()}</h2>
              <h1 className="text-gray-400 text-sm">
                <a href={`mailto:${data.email}`} className="text-gray-400 hover:underline">
                  {data.email}
                </a>
              </h1>
            </div>
          </div>

          <div className="bg-gray-200 px-4 py-4 my-4">
            <div className="flex text-xs justify-between pb-3">
              <p className="font-bold">Applied Jobs</p>  <p>{format(new Date(data.created_at), 'MMMM dd, yyyy')}</p>
            </div>
            <div className="flex">
              <p className="text-sm font-bold">Categories:</p> <p className="text-sm ml-2">{data.categories}</p>
            </div>
            <div className="flex">
              <p className="text-sm font-bold">Salary:</p> <p className="text-sm ml-2">{data.salary_type}</p>
              <p className="font-bold">Applied Jobs</p>  <p>{format(new Date(data.created_at), 'MMMM dd, yyyy')}</p>
            </div>
            <div className="flex">
              <p className="text-sm font-bold">Categories:</p> <p className="text-sm ml-2">{data.categories}</p>
            </div>
            <div className="flex">
              <p className="text-sm font-bold">Salary:</p> <p className="text-sm ml-2">{data.salary_type}</p>
            </div>
          </div>
          <hr />
          <div className="text-md px-4 py-4">
            <h1 className="font-bold">Contact</h1>
            <div className="flex items-center space-x-2">
              <MdEmail className="text-gray-600" />
              <span>{data.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MdPhone className="text-gray-600" />
              <span>{data.phone_number}</span>
            </div>
            {renderSocialMedia(data.social_media_handle)}
          </div>
        </div>

        <div className="shadow-lg px-4 py-4 md:col-span-1.5">
          <div className="pb-4">
            <BsShieldLock className="text-green-500 text-4xl" />
            <h1 className="font-bold">Skills</h1>
            <div className="text-sm px-4 py-4">
              <div dangerouslySetInnerHTML={{ __html: data.experience }} />
              <h2>{data.personal_profile}</h2>
            </div>
          </div>
          <hr />
          <h1 className="font-bold py-4">Details</h1>
          <div className="text-sm px-4 py-4 grid grid-cols-2 gap-2">
            <p className="text-sm font-bold">DOB:</p> <p className="text-sm">{data.date_of_birth}</p>
            <p className="text-sm font-bold">Gender:</p> <p className="text-sm">{data.gender}</p>
            <p className="text-sm font-bold">Qualification:</p> <p className="text-sm">{data.qualification}</p>
            <p className="text-sm font-bold">Country:</p> <p className="text-sm">{data.country}</p>
            <p className="text-sm font-bold">State:</p> <p className="text-sm">{data.state}</p>
            <p className="text-sm font-bold">Local government:</p> <p className="text-sm">{data.local_gov}</p>
            <p className="text-sm font-bold">Means of Identification:</p> <p className="text-sm">{data.means_of_identification}</p>
            <p className="text-sm font-bold">NIN:</p> <p className="text-sm">{data.nin}</p>
            <p className="text-sm font-bold">NIN Slip:</p> <p className="text-sm">{renderNinSlip(data.nin_slip)}</p>
            <p className="text-sm font-bold">Educational Qualification:</p> <p className="text-sm">{data.educational_qualification}</p>
            <p className="text-sm font-bold">Work Experience:</p> <p className="text-sm">{data.work_experience}</p>
            <p className="text-sm font-bold">Introduction Video:</p> <p className="text-sm">
              {data.introduction_video && (
                <video src={`https://dash.mayrahkeeafrica.com/${data.introduction_video}`} controls className="mt-2 w-full" />
              )}
            </p>
            <p className="text-sm font-bold">Status:</p> <p className="text-sm">{data.status}</p>
          </div>
          <hr />
          <BsEye className="text-green-500 text-4xl" />
          <h1 className="font-bold py-4">Languages spoken</h1>
          <div className="text-sm px-4 py-4">
            {data.languages}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;