import { useState, useEffect } from "react";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { FaArrowLeftLong, FaGlobe, FaLinkedin } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import { ClipLoader } from "react-spinners";

const EmployerCandidates = () => {
  const { loading, jobsAppliedToEmployerId, getReportById } = UseAdminManagement();
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
        const uniqueEmployers = data.filter((employer, index, self) =>
          index === self.findIndex((e) => e.candidate_id === employer.candidate_id)
        );
        setEmployers(uniqueEmployers);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (


    
    <div className="max-w-screen-lg mx-auto mt-10">
       <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100 mb-3"
        >
       <FaArrowLeftLong className="me-4 text-green-500" />Back
        </button>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-8">Employer's Candidates</h2>
      {employers.length === 0 ? (
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-bold">No candidates found</h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {employers.slice(first, first + rows).map((employer) => (
              <div key={employer.candidate_id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                {/* Job Information */}
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{employer.job_title}</h3>
                  <p className="text-sm text-gray-600">{employer.job_description}</p>
                </div>

                {/* Candidate Information */}
                <div className="mb-4 border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-700">Candidate Information</h4>
                  <p className="text-gray-600"><strong>Name:</strong> {employer.full_name}</p>
                  <p className="text-gray-600"><strong>Email:</strong> {employer.email}</p>
                  <p className="text-gray-600"><strong>Phone:</strong> {employer.phone_number}</p>
                  <p className="text-gray-600"><strong>Status:</strong> {employer.status}</p>
                </div>

                {/* Social Links */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-700">Media and Links</h4>
                  <div className="flex justify-center space-x-6 mt-2">
                    {employer.linkedin_url && (
                      <a
                        href={employer.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaLinkedin className="text-2xl" />
                      </a>
                    )}
                    {employer.portfolio_url && (
                      <a
                        href={employer.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaGlobe className="text-2xl" />
                      </a>
                    )}
                    {employer.resume_path && (
                      <a
                        href="#"
                        onClick={(event) => handleResumeClick(event, employer.resume_path)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaFileAlt className="text-2xl" />
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
};

export default EmployerCandidates;
