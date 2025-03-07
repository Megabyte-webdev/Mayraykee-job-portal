import { useState, useEffect } from "react";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function AllDataJobsPostedEmployer() {
    const { loading, getJobsByEmployerId } = UseAdminManagement();
    const [jobs, setJobs] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            const data = await getJobsByEmployerId(id);
            const sortedData = data.sort((a, b) => b.id - a.id);
            console.log(data);
            if (data) {
                setJobs(sortedData);
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

    if (jobs.length === 0) {
        return <div className="flex justify-center items-center h-screen">No jobs posted by this employer</div>;
    }

    const heading = ["ID", "Job Title", "Job Description", "Sector", "Type", "Experience", "Status"];

    const data = jobs.map(job => ({
        [heading[0].toLowerCase()]: job.id,
        [heading[1].toLowerCase()]: job.job_title,
        [heading[2].toLowerCase()]: job.job_description,
        [heading[3].toLowerCase()]: job.sector,
        [heading[4].toLowerCase()]: job.type,
        [heading[5].toLowerCase()]: job.experience,
        [heading[6].toLowerCase()]: job.status,
    }));

    return (
        <div className="mt-10">
            <button
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
            >
                <FaArrowLeftLong className="me-4 text-green-500" />Back
            </button>
            <h2 className="text-black border-b border-gray-500 text-2xl font-bold mt-10">Jobs Posted By Employers</h2>
            <DataTableComponent heading={heading} data={data} loading={loading} name="employer-jobs" />
        </div>
    );
}

export default AllDataJobsPostedEmployer;