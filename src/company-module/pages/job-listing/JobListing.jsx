import { Helmet } from "react-helmet";
import Header from "../../components/job-listing/Header";
import ListingRow from "../../components/job-listing/ListingRow";
import useJobManagement from "../../../hooks/useJobManagement";
import useApplicationManagement from "../../../hooks/useApplicationManagement";
import { useContext } from "react";
import { ApplicationContext } from "../../../context/ApplicationContext";
import { JobContext } from "../../../context/JobContext";

function JobListing() {
  const jobUtils = useContext(JobContext);
  const { applicants } = useContext(ApplicationContext);

  return (
    <>
      <Helmet>
        <title>Company Dashboard | Job Listing </title>
      </Helmet>
      <div className="h-full w-full flex flex-col px-4 md:px-12 py-5 gap-4 md:gap-[15px]">
        <div className="w-full flex flex-col md:flex-row justify-between">
          <div className="flex flex-col">
            <h2 className="font-semibold text-md">Job Listing</h2>
            <span className="text-sm md:text-little text-gray-400">
              Here is your jobs listing status from July 19 - July 25.
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="border bg-white text-gray-600 font-semibold">
              <tr className="text-xs md:text-little divide-gray-200">
                <th className="px-2 md:px-4 py-1 text-center">Roles</th>
                <th className="px-2 md:px-4 py-1 text-center">Status</th>
                <th className="px-2 md:px-4 py-1 text-center">Date Posted</th>
                <th className="px-2 md:px-4 py-1 text-center">Due Date</th>
                <th className="px-2 md:px-4 py-1 text-center">Job Type</th>
                <th className="px-2 md:px-4 py-1 text-center">Applicants</th>
                <th className="px-2 md:px-4 py-1 text-center">Gender</th>
              </tr>
            </thead>

            <tbody>
              {jobUtils?.jobList.sort((a, b)=>{
return new Date(b.createdAt) - new Date(a.createdAt);
}).map((current) => {
                  const jobApplicants = applicants?.filter(
                    (currentApplicant) => current.id === currentApplicant.job_id
                  );
                  return (
                    <ListingRow
                      applicants={jobApplicants}
                      data={current}
                      key={current.id}
                    />
                  );
                })
                .reverse()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default JobListing;
