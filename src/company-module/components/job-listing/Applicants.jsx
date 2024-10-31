import { useState } from "react";
import ApplicantsList from "./ApplicantsList";
import ApplicantsGrid from "./ApplicantsGrid";

function Applicants({ applicants }) {
  const [view, setView] = useState("grid");

  return (
    <div className="p-2 flex flex-col w-full gap-[10px]">
      <div className="flex flex-col gap-2 md:flex-row justify-between items-center">
        <span className="w-full text-sm md:text-base">Total Applicants: {applicants.length}</span>

        <div className="w-full flex flex-col md:flex-row gap-[10px]">
          <input
            className="py-1 px-2 border text-sm md:text-base"
            placeholder="Search Applicant"
          />

          <div className="p-1 bg-primaryColor flex justify-between gap-[3px]">
            <button
              onClick={() => setView("grid")}
              className={`h-full p-1 text-sm md:text-base ${
                view === "grid"
                  ? "bg-primaryColor text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Pipeview
            </button>
            <button
              onClick={() => setView("table")}
              className={`h-full p-1 text-sm md:text-base ${
                view === "table"
                  ? "bg-primaryColor text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Tableview
            </button>
          </div>
        </div>
      </div>

      {view === "table" ? <ApplicantsList applicants={applicants} /> : <ApplicantsGrid applicants={applicants} />}
    </div>
  );
}

export default Applicants;
