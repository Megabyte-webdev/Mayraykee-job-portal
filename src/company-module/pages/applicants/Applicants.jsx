import { Helmet } from "react-helmet";
import ApplicantRow from "../../components/applicants/ApplicantRow";
import useApplicationManagement from "../../../hooks/useApplicationManagement";
import { useContext, useEffect, useState } from "react";
//import { ApplicationContext } from "../../../context/ApplicationContext";
import { BsGrid, BsGridFill } from "react-icons/bs";
import { TbLayoutList, TbLayoutListFilled } from "react-icons/tb";
import InterviewGridCard from "../schedule/InteviewGridCard";
import ApplicateGridCard from "./ApplicantsGrid";

function Applicants() {
  const applicationUtils = useApplicationManagement();
  const [isGrid, setIsGrid] = useState(false);

  useEffect(() => {
    applicationUtils.getApplicantsByEmployee();
  }, []);
 // console.log(applicationUtils?.applicants);
  return (
    <>
      <Helmet>
        <title>Company Dashboard | All Applicants </title>
      </Helmet>
      <div className="h-full w-full flex flex-col py-2 gap-[15px]">
        <div className="w-full flex justify-between ">
          <h2 className="font-semibold text-md">
            Total Applicants: {applicationUtils.applicants?.length}
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

        {isGrid ? (
          <ul className="grid grid-cols-responsive gap-5 px-3">
            {applicationUtils?.applicants &&
              applicationUtils?.applicants
                ?.map((current) => (
                  <ApplicateGridCard key={current.id} data={current} />
                ))
                .reverse()}
          </ul>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="border bg-white  text-gray-600 font-semibold ">
              <tr className=" text-little  divide-gray-200">
                <th className="px-4 py-1 text-center">Full Name</th>
                <th className="px-4 py-1 hidden md:block text-center">Email</th>
                <th className="px-4 py-1 text-center">Status</th>
                <th className="px-4 py-1 hidden md:block text-center">
                  Applied Date
                </th>
                <th className="px-4 py-1 text-center">Job Role</th>
                <th className="px-4 py-1 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {applicationUtils?.applicants &&
                applicationUtils?.applicants
                  ?.map((current) => (
                    <ApplicantRow key={current.id} data={current} />
                  ))
                  .reverse()}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Applicants;
