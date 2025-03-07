import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import { FaLinkedin, FaGlobe, FaFileAlt } from "react-icons/fa";
import { format } from "date-fns";
import { FaArrowLeftLong } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";

const JobDescriptionPage = () => {
    const { id } = useParams();
    const {loading, getJobById } = UseAdminManagement();
    const [job, setJob] = useState(null);

    useEffect(() => {
        (async () => {
            const data = await getJobById(id);
            if (data) {
                setJob(data);
            } else {
                console.error("No data received");
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
    
    if (!job) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-auto mt-10 max-w-screen-lg">
            
            <button
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100 mb-3"
            >
                <FaArrowLeftLong className="me-4 text-green-500" />Back
            </button>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="mb-4">
                    {/* Job Title and Description */}
                    <h3 className="text-2xl font-bold text-gray-800">{job?.job_title}</h3>
                    <p className="text-gray-500 mb-2" dangerouslySetInnerHTML={{__html:job?.job_description}} />
                </div>

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                    <div className="md:w-8/12">
                        {/* Job Details Section */}
                        <div className="mb-4 border-t pt-4 space-y-2">
                            <h4 className="text-lg font-semibold text-gray-900">Job Details</h4>
                            <p className="text-gray-600"><strong>Sector:</strong> {job?.sector}</p>
                            <p className="text-gray-600"><strong>Type:</strong> {job?.type}</p>
                            <p className="text-gray-600"><strong>Categories:</strong> {job?.search_keywords}</p>
                            <p className="text-gray-600"><strong>Experience:</strong> <span dangerouslySetInnerHTML={{__html:job?.experience}}/></p>
                            <p className="text-gray-600"><strong>Career Level:</strong> {job?.career_level}</p>
                            <p className="text-gray-600"><strong>Application Deadline:</strong> {format(new Date(job?.application_deadline_date), 'MMMM dd, yyyy')}</p>
                        </div>

                        {/* Employer Information Section */}
                        <div className="mb-4 border-t pt-4 space-y-2">
                            <h4 className="text-lg font-semibold text-gray-700">Employer Information</h4>
                            <p className="text-gray-600"><strong>Email:</strong> <a href={`mailto:${job?.email}`} className="text-blue-600 underline break-all">{job?.email}</a></p>
                            <p className="text-gray-600"><strong>Preferred Age:</strong> {job?.preferred_age}</p>
                            <p className="text-gray-600"><strong>Office Address:</strong> {job?.office_address}</p>
                            <p className="text-gray-600"><strong>Qualifications:</strong> {job?.qualification.join(", ")}</p>
                        </div>

                        {/* Social Media and Links */}
                        <div className="mb-4 border-t pt-4 space-y-2">
                            <h4 className="text-lg font-semibold text-gray-700">Media and Links</h4>
                            <div className="flex space-x-4">
                                {job?.linkedin_url && (
                                    <a
                                        href={job?.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FaLinkedin className="text-2xl" />
                                    </a>
                                )}
                                {job?.external_url && (
                                    <a
                                        href={job?.external_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FaGlobe className="text-2xl" />
                                    </a>
                                )}
                                {job?.resume_path && (
                                    <a
                                        href={job?.resume_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FaFileAlt className="text-2xl" />
                                    </a>
                                )}
                            </div>
                            {job?.introduction_video_url && (
                                <video src={job?.introduction_video_url} controls className="w-full max-w-md h-auto mt-2" />
                            )}
                        </div>
                    </div>

                    <div className="md:w-4/12 space-y-6">
                        {/* Salary and Location Section */}
                        <h2 className="bg-slate-100 px-2 py-2 font-bold" >About</h2>
                        <div className="mb-4 border-t pt-4 space-y-3">
                            <h4 className="text-lg font-semibold text-gray-700">Compensation and Location</h4>
                            <p className="text-gray-600"><strong>Min Salary:</strong> {job?.currency} {job?.min_salary}</p>
                            <p className="text-gray-600"><strong>Max Salary:</strong> {job?.currency} {job?.max_salary}</p>
                            <p className="text-gray-600"><strong>Location:</strong> {job?.location}</p>
                            <p className="text-gray-600"><strong>Maps Location:</strong> <a href={job?.maps_location} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Map</a></p>
                        </div>

                        {/* Status and Dates */}
                        <div className="border-t pt-4 space-y-2">
                            <h4 className="text-lg font-semibold text-gray-700 bg-slate-100 px-2 py-2">Status and Timestamps</h4>
                            <p className="text-gray-600"><strong>Status:</strong> {job?.status === "1" ? "Inactive" : "Active"}</p>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {job?.search_keywords.split(',').map((keyword, index) => (
                                    <span key={index} className={`px-3 py-1 rounded-full text-sm font-semibold ${index % 2 === 0 ? 'bg-[#EB85331A] text-[#FFB836]' : 'bg-green-100 text-green-800'}`}>
                                        {keyword.trim()}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-600"><strong>Created At:</strong> {format(new Date(job?.created_at), 'MMMM dd, yyyy')}</p>
                            <p className="text-gray-600"><strong>Updated At:</strong> {format(new Date(job?.updated_at), 'MMMM dd, yyyy')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDescriptionPage;
