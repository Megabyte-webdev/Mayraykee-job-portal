import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { BiBriefcase } from "react-icons/bi";
import approved from "../../assets/pngs/approved.png";
import company from "../../assets/pngs/company-2-icon.png";
import { ResourceContext } from "../../context/ResourceContext";
import { IMAGE_URL } from "../../utils/base";
import { parseHtml } from "../../utils/formmaters";

// Modal Component with TailwindCSS for a polished UI/UX
const ApplyJobModal = ({ isOpen, closeModal, navigateToRegister, navigateToLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300">
      {/* Modal Box with animation */}
      <div className="bg-white rounded-lg w-full max-w-md p-8 text-center shadow-xl transform transition-all duration-300 scale-95">
        <h2 className="text-2xl md:text-3xl uppercase font-bold mb-4 text-green-800">Job Application Info</h2>
        <p className="text-base md:text-lg mb-6 text-gray-600 font-medium leading-relaxed">
          To apply for a job, you need to create an account. Please register to proceed with the application.
        </p>
        
        <div className="flex justify-between gap-4 mb-6 *:text-sm md:*:text-xl">
          <button
            className="bg-green-600 text-white py-2 px-6 rounded-full text-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            onClick={navigateToRegister}
          >
            Register
          </button>
          <button
            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-full text-lg hover:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            onClick={closeModal}
          >
            Close
          </button>
        </div>

        {/* "Already have an account?" Text Link */}
        <div className="mt-4 text-sm text-gray-600">
          <span>Already have an account? </span>
          <button
            onClick={navigateToLogin}
            className="text-blue-500 font-medium hover:text-blue-600 underline focus:outline-none"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Jobs Component
const Jobs = () => {
  const navigate = useNavigate();
  const { setGetAllFeaturedJobs, getAllFeaturedJobs } = useContext(ResourceContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all jobs
  useEffect(() => {
    try {
      setLoading(true);
      setError("");
      setGetAllFeaturedJobs((prev) => ({
        ...prev,
        isDataNeeded: true,
      }));
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
      setLoading(false);
    }
  }, [setGetAllFeaturedJobs]);

  useEffect(() => {
    if (getAllFeaturedJobs?.data) {
      const fetchedJobs = getAllFeaturedJobs?.data || [];
      const neededJobs = fetchedJobs.filter(
        (one) => parseInt(one?.feature_jobs) === 1
      );
      setJobs(neededJobs.slice(0, 6));
      setLoading(false);
    } else if (getAllFeaturedJobs?.error) {
      setError("Failed to fetch jobs. Please try again.");
      setLoading(false);
    }
  }, [getAllFeaturedJobs]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigateToRegister = () => {
    navigate("/registration");
    closeModal();
  };
  const navigateToLogin = () => {
    navigate("/login");
    closeModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10 min-h-60 bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-40 bg-gray-100 text-center">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex text-center justify-center items-center min-h-40 bg-gray-100">
        <p className="text-lg font-medium text-gray-700">
          No jobs featuring at the moment. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-items-center gap-y-10">
        {jobs.map((job) => (
          <div
            key={job?.id}
            className="flex flex-col w-80 min-h-60 p-6 pb-3 rounded-xl shadow-lg bg-white hover:shadow-2xl transform transition duration-300"
          >
            <section className="flex justify-between gap-3">
              <div>
                <h4 className="capitalize text-xl font-semibold my-2 text-gray-800">{job?.job_title}</h4>
                <p className="font-semibold text-sm text-gray-500 flex gap-2 items-center">
                  {job?.sector || ""}{" "}
                  <img src={approved} alt="approved" className="w-5" />
                </p>
              </div>
              <img
                src={job?.featured_image ? `${IMAGE_URL}/${job?.featured_image}` : company}
                alt="img"
                className="h-12 w-12 object-cover rounded-full"
              />
            </section>
            <p
              className="text-gray-500 text-sm my-3"
              
            >{parseHtml(job?.job_description.slice(0, 50))}</p>

            <div className="flex gap-3 mt-auto text-green-600 capitalize text-xs">
              <span className="flex items-center gap-2">
                <BiBriefcase size="15" /> {job?.type}
              </span>
            </div>
            <button
              onClick={openModal}
              className="my-2 cursor-pointer font-medium py-2 px-6 rounded-full capitalize w-full bg-black text-sm text-white hover:bg-gray-800 transition-colors duration-200"
            >
              Apply now
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ApplyJobModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        navigateToRegister={navigateToRegister}
        navigateToLogin={navigateToLogin}
      />
    </div>
  );
};

export default Jobs;
