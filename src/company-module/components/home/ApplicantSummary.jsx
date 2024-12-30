import MultipleProgressBar from "./MultipleProgressBar";
import "../../../css/styles.css";
import { CompanyRouteContext } from "../../../context/CompanyRouteContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function ApplicantSummary({ applicants, byCategory, jobs }) {
  const { setSideBar } = useContext(CompanyRouteContext);
  const navigate = useNavigate();

  return (
    <div className="md:h-[65%] h-fit w-full border p-3 justify-between flex flex-col">
      <h2 className="text-sm font-semibold">Applicants Summary</h2>

      <div className="flex gap-[5px] items-end">
        <span className="font-semibold text-2xl">{applicants?.length}</span>
        <span className="text-little">Applicants</span>
      </div>

      <div className="w-full flex flex-col gap-[10px]">
        <MultipleProgressBar
          applicants={byCategory}
          totalApplicants={applicants?.length}
        />
        <ul className="grid grid-cols-1">
          {byCategory &&
            Object.keys(byCategory)?.splice(0,3).map((current) => {
              const info = byCategory[current];
              const jobApplicants = applicants?.filter(
                  (currentApplicant) => currentApplicant.job_id === info[0].job_id
                );
              return (
                <>
                  <div
                  key={current.id}
                    className={` list-item-parent flex h-full text-[11px] items-center gap-[5px]`}
                  >
                    <div className={`h-[10px] w-[10px] rounded-[3px] child`} />
                    <span
                      onClick={() => {
                        setSideBar(4);
                        navigate(`/company/job-listing/type/${current}`,{ state: { data: jobs.find(one=> Number(one.id) === Number(info[0].job_id)), applicants: jobApplicants } });
                      }}
                      className=" font-semibold hover:underline cursor-pointer"
                    >
                      {info[0].job_title} :
                    </span>
                    <span className="text-gray-400">{info?.length}</span>
                  </div>
                </>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default ApplicantSummary;
