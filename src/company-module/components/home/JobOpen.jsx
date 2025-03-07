import { useContext } from "react";
import { CompanyRouteContext } from "../../../context/CompanyRouteContext";
import { useNavigate } from "react-router-dom";

function JobOpen({ data }) {
  const { setSideBar } = useContext(CompanyRouteContext);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        setSideBar(4);
        navigate("/company/job-listing");
      }}
      className="w-full h-fit md:h-[30%] hover:scale-105 duration-100 cursor-pointer justify-between px-3 py-[3px] flex flex-col border"
    >
      <h3 className="font-semibold text-gray-700">Open jobs</h3>

      <div className="flex gap-[10px] items-end">
        <span className="font-semibold text-4xl">{data?.length}</span>
        <span className="text-md">Jobs opened</span>
      </div>
    </div>
  );
}

export default JobOpen;
