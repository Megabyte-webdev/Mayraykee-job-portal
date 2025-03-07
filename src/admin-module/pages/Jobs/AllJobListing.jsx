import { useState, useEffect } from "react";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import { FaArrowLeftLong } from "react-icons/fa6";
import ToggleSwitch from "./Tools/ToggleBtn";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { onSuccess } from "../../../utils/notifications/OnSuccess";

function AllJobs() {
  const { loading, getAllJobs, updateFeaturedJobs } = UseAdminManagement();
  const [jobs, setJobs] = useState([]);
  const [loadingToggles, setLoadingToggles] = useState({}); // Track loading state for each toggle

  useEffect(() => {
    (async () => {
      const data = await getAllJobs();
      const sortedData = data.sort((a, b) => b.id - a.id);
      if (data) {
        // const updatedJobs = sortedData.map((job) => ({
        //   ...job,
        //   isFeatured: job.feature_jobs === "1", 
        // }));
        setJobs(sortedData);
      } else {
        console.error("No data received");
      }
    })();
  }, []);

  const handleToggle = async (job, currentStatus) => {
    const id = job.id;
  
    // Immediately set loading state
    setLoadingToggles((prev) => ({ ...prev, [id]: true })); 
  
    const updatedStatus = currentStatus ? "0" : "1";
  
    try {
      const response = await updateFeaturedJobs(job, updatedStatus);
  
      if (response) {
        // Optimistically update state immediately after success
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === id ? { ...job, feature_jobs: updatedStatus } : job
          )
        );
  
        onSuccess({
          message: "Job Update Status",
          success: "Updated successfully",
        });
      }
    } catch (error) {
      onFailure({
        message: "Job Update Error",
        error: "Failed to update",
      });
    } finally {
      // Ensure loading state is removed
      setLoadingToggles((prev) => ({ ...prev, [id]: false }));
    }
  };
  
  

  const heading = ["ID", "Title", "Salary Type", "Sector", "Type", "Status", "Featured Jobs"];

  const data = jobs.map((job) => ({
    [heading[0].toLowerCase()]: job.id,
    [heading[1].toLowerCase()]: job.job_title,
    [heading[2].toLowerCase()]: job.salary_type,
    [heading[3].toLowerCase()]: job.sector,
    [heading[4].toLowerCase()]: job.type,
    [heading[5].toLowerCase()]: job.status,
    [heading[6].toLowerCase()]: (
      <ToggleSwitch
        isOn={job.feature_jobs === "1"}
        isLoading={loadingToggles[job.id]} // Pass loading state for specific toggle
        onToggle={() => handleToggle(job, job?.feature_jobs === "0" ? false : true)}
      />
    ),
  }));

  return (
    <div className="mt-10">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
      >
        <FaArrowLeftLong className="me-4 text-green-500" />
        Back
      </button>
      <h2 className="text-black border-b border-gray-500 text-2xl font-bold mt-10">Jobs</h2>
      <DataTableComponent heading={heading} data={data} loading={loading} name="job" allowEdit={true} />
    </div>
  );
}

export default AllJobs;
