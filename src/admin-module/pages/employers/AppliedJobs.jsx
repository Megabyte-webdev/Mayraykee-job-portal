import { useState, useEffect } from "react";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { FaArrowLeftLong, FaGlobe, FaLinkedin } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import { ClipLoader } from "react-spinners";

function AppliedJobs() {
  const { loading, jobsAppliedToEmployerId } = UseAdminManagement();
  const [employers, setEmployers] = useState([]);
  const { id } = useParams();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(2);
  const [resumeContent, setResumeContent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await jobsAppliedToEmployerId(id);
      if (data) {
        setEmployers(data);
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

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleResumeClick = (event, resumePath) => {
    event.preventDefault();
    setResumeContent(`https://dash.mayrahkeeafrica.com/resumes/${resumePath}`);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setResumeContent(null);
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-10">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100 mb-3"
      >
        <FaArrowLeftLong className="me-4 text-green-500" />Back
      </button>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-8">Applied Jobs</h2>
      {employers.length === 0 ? (
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-bold">No applied jobs</h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {employers.slice(first, first + rows).map((employer) => (
              <div
                key={employer.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                {/* Job Title and Description */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{employer.job_title}</h3>
                  <p className="text-gray-500 mb-2">{employer.job_description}</p>
                </div>

                {/* Applicant Information */}
                <div className="mb-4 border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-700">Applicant Information</h4>
                  <p className="text-gray-600"><strong>Name:</strong> {employer.full_name}</p>
                  <p className="text-gray-600"><strong>Email:</strong> {employer.email}</p>
                  <p className="text-gray-600"><strong>Phone Number:</strong> {employer.phone_number}</p>
                  <p className="text-gray-600"><strong>Status:</strong> {employer.status}</p>
                </div>

                {/* Social Media and Links */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-700">Media and Links</h4>
                  <div className="flex space-x-4 mt-2">
                    {employer.linkedin_url && (
                      <a
                        href={employer.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        <FaLinkedin className="text-2xl" /> LinkedIn
                      </a>
                    )}
                    {employer.portfolio_url && (
                      <a
                        href={employer.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        <FaGlobe className="text-2xl" /> Portfolio
                      </a>
                    )}
                    {employer.resume_path && (
                      <a
                        href="#"
                        onClick={(event) => handleResumeClick(event, employer.resume_path)}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        <FaFileAlt className="text-2xl" /> Resume
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={employers.length}
            rowsPerPageOptions={[2, 4, 6]}
            onPageChange={onPageChange}
            className="mt-6"
          />
        </>
      )}
      <Dialog
        header="Resume"
        visible={isModalVisible}
        onHide={closeModal}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        {resumeContent && (resumeContent.endsWith(".pdf") ? (
          <iframe src={resumeContent} width="100%" height="500px" />
        ) : (
          <img src={resumeContent} alt="Resume" className="w-full h-auto" />
        ))}
      </Dialog>
    </div>
  );
}

export default AppliedJobs;