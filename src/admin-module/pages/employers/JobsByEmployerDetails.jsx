import { useState, useEffect } from "react";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { FaLinkedin, FaGlobe, FaFileAlt } from "react-icons/fa";
import { format } from "date-fns";
import { ClipLoader } from "react-spinners";

function JobsByEmployerDetails() {
  const { loading, getJobById } = UseAdminManagement();
  const [employers, setEmployers] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const data = await getJobById(id);
        if (data) {
          setEmployers([data]); // Ensure data is an array
        } else {
          console.error("No data received");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-screen-lg px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100 mb-3"
      >
        <FaArrowLeftLong className="me-4 text-green-500" />Back
      </button>
      {employers.length === 0 ? (
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-semibold">No posted jobs</h2>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Jobs Posted by Employer</h2>
          <div className="grid grid-cols-1 gap-8">
            {employers.map((employer) => (
              <div
                key={employer.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                {/* Job Title and Description */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{employer.job_title}</h3>
                  <p className="text-gray-500 mb-2" dangerouslySetInnerHTML={{__html: employer?.job_description}} />
                </div>

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                  <div className="md:w-8/12">
                    {/* Job Details Section */}
                    <div className="mb-4 border-t pt-4 space-y-2">
                      <h4 className="text-lg font-semibold text-gray-700">Job Details</h4>
                      <p className="text-gray-600"><strong>Sector:</strong> {employer.sector}</p>
                      <p className="text-gray-600"><strong>Type:</strong> {employer.type}</p>
                      <p className="text-gray-600"><strong>Search Keywords:</strong> {employer.search_keywords}</p>
                      <p className="text-gray-600"><strong>Experience:</strong> <span dangerouslySetInnerHTML={{__html: employer?.experience}} /> </p>
                      <p className="text-gray-600"><strong>Career Level:</strong> {employer.career_level}</p>
                      <p className="text-gray-600"><strong>Qualification:</strong> {employer.qualification.join(', ')}</p>
                      <p className="text-gray-600"><strong>Application Deadline:</strong> {format(new Date(employer.application_deadline_date), 'MMMM dd, yyyy')}</p>
                    </div>

                    {/* Employer Information Section */}
                    <div className="mb-4 border-t pt-4 space-y-2">
                      <h4 className="text-lg font-semibold text-gray-700">Employer Information</h4>
                      <p className="text-gray-600"><strong>Email:</strong> <a type="mail" href={`mailto:${employer.email}`} className="text-blue-600 underline">{employer.email}</a></p>
                      <p className="text-gray-600"><strong>Preferred Age:</strong> {employer.preferred_age}</p>
                      <p className="text-gray-600"><strong>Gender:</strong> {employer.gender}</p>
                      <p className="text-gray-600"><strong>Number of Participants:</strong> {employer.number_of_participants}</p>
                    </div>

                    {/* Social Media and Links */}
                    <div className="mb-4 border-t pt-4 space-y-2">
                      <h4 className="text-lg font-semibold text-gray-700">Media and Links</h4>
                      <div className="flex space-x-4">
                        {employer.linkedin_url && (
                          <a
                            href={employer.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaLinkedin className="text-2xl" />
                          </a>
                        )}
                        {employer.portfolio_url && (
                          <a
                            href={employer.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaGlobe className="text-2xl" />
                          </a>
                        )}
                        {employer.resume_path && (
                          <a
                            href={employer.resume_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaFileAlt className="text-2xl" />
                          </a>
                        )}
                      </div>
                      {employer.introduction_video_url && (
                        <video src={employer.introduction_video_url} controls className="w-full max-w-md h-auto mt-2" />
                      )}
                    </div>
                  </div>

                  <div className="md:w-4/12 space-y-9">
                    {/* Salary and Location Section */}
                    <div className="mb-4 border-t pt-4 space-y-3">
                      <h2 className="font-bold bg-[#F8F8FD] px-2 py-2">About </h2>
                      <h4 className="text-lg font-semibold text-gray-700">Compensation and Location</h4>
                      <p className="text-gray-600"><strong>Min Salary:</strong> {employer.min_salary}</p>
                      <p className="text-gray-600"><strong>Max Salary:</strong> {employer.max_salary} {employer.currency}</p>
                      <p className="text-gray-600"><strong>Office Address:</strong> {employer.office_address}</p>
                      <p className="text-gray-600"><strong>Location:</strong> {employer.location}</p>
                      <p className="text-gray-600"><strong>Maps Location:</strong> <a href={employer.maps_location} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Map</a></p>
                    </div>

                    {/* Status and Dates */}
                    <div className="border-t pt-8 space-y-2">
                      <h4 className="text-lg font-semibold text-gray-700 bg-[#F8F8FD] px-2 py-2">Status and Timestamps</h4>
                      <p className="text-gray-600"><strong>Status:</strong> {employer.status}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {employer.search_keywords.split(',').map((keyword, index) => (
                          <span key={index} className={`px-3 py-1 rounded-full text-sm font-semibold ${index % 2 === 0 ? 'bg-[#EB85331A] text-[#FFB836]' : 'bg-green-100 text-green-800'}`}>
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 mt-2"><strong>Created At:</strong> {format(new Date(employer.created_at), 'MMMM dd, yyyy')}</p>
                      <p className="text-gray-600"><strong>Updated At:</strong> {format(new Date(employer.updated_at), 'MMMM dd, yyyy')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default JobsByEmployerDetails;
