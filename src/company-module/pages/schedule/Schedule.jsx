import { Helmet } from "react-helmet";
import ApplicantRow from "../../components/applicants/ApplicantRow";
import useApplicationManagement from "../../../hooks/useApplicationManagement";
import { useContext, useEffect, useState } from "react";
//import { ApplicationContext } from "../../../context/ApplicationContext";
import { InterviewContext } from "../../../context/InterviewContext";
import { BsGrid, BsGridFill } from "react-icons/bs";
import { TbLayoutList, TbLayoutListFilled } from "react-icons/tb";
import InterviewGridCard from "./InteviewGridCard";

function Schedule() {
  const applicationUtils = useApplicationManagement();
  const interviewUtils = useContext(InterviewContext);
  const [isGrid, setIsGrid] = useState(false);

  useEffect(() => {
    applicationUtils.getApplicantsByEmployee();
    interviewUtils.getAllInterviews(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Company Dashboard | My Schedules </title>
      </Helmet>
      <div className="h-full w-full flex flex-col px-4 md:px-12 py-2 gap-4 md:gap-[15px]">
        <div className="w-full flex flex-col md:flex-row justify-between items-center">
          <h2 className="font-semibold text-sm md:text-md mb-2 md:mb-0">
            Total Interviews: {interviewUtils.interviews.length}
          </h2>
          <div className="border- px-2">
            <button
              onClick={() => setIsGrid(true)}
              className="bg-gray-200 rounded p-1 mx-1"
            >
              {isGrid ? <BsGridFill className="prime_text" /> : <BsGrid />}
            </button>
            <button
              onClick={() => setIsGrid(false)}
              className="bg-gray-200 rounded p-1 mx-1"
            >
              {isGrid ? (
                <TbLayoutList />
              ) : (
                <TbLayoutListFilled className="prime_text" />
              )}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto ">
          {isGrid ? (
            <ul className="grid grid-cols-responsive gap-5 px-3">
              {applicationUtils?.applicants &&
                applicationUtils?.applicants?.map((current) => (
                  <InterviewGridCard key={current.id} data={current} />
                ))}
            </ul>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="border bg-white text-gray-600 font-semibold">
                <tr className="text-xs md:text-sm divide-gray-200">
                  <th className="px-2 md:px-4 py-1 text-center">Full Name</th>
                  <th className="px-2 md:px-4 py-1 text-center hidden md:block">Email</th>
                  <th className="px-2 md:px-4 py-1 text-center">Status</th>
                  <th className="px-2 md:px-4 py-1 text-center hidden md:block">
                    Applied Date
                  </th>
                  <th className="px-2 md:px-4 py-1 text-center">Job Role</th>
                  <th className="px-2 md:px-4 py-1 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {applicationUtils?.applicants &&
                  applicationUtils?.applicants?.map((current) => (
                    <ApplicantRow key={current.id} data={current} />
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Schedule;
