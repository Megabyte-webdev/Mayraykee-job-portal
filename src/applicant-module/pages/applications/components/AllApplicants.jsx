import React, { useState, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useJobManagement from "../../../../hooks/useJobManagement";
import { resourceUrl } from "../../../../services/axios-client";
import { FormatTextToUppecase } from "../../../../utils/formmaters";
import { stages } from "../../../../utils/constants";
import { onPrompt } from "../../../../utils/notifications/onPrompt";
import { MdMoreHoriz } from "react-icons/md";
import { ApplicationContext } from "../../../../context/ApplicationContext";

const AllApplicants = ({ app, index }) => {
  const dateCreated = new Date(app?.created_at);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const { getJobById } = useJobManagement();
  const { setApplication } = useContext(ApplicationContext);
  const getBorderColor = () => {
    switch (app?.status) {
      case stages[0].name:
        return "text-orange-500 border-orange-500";
      case stages[1].name:
        return "text-blue-700 border-blue-700";
      case stages[2].name:
        return "text-yellow-500 border-yellow-500";
      case stages[3].name.split("/")[0]:
        return "text-primaryColor border-primaryColor";
      case stages[3].name.split("/")[1]:
        return "text-[#8B0A1A] border-[#8B0A1A]";
      default:
        return "";
    }
  };

  const handleClick = () => {
    if (app?.status === stages[1].name) {
      setApplication({ ...app });
      navigate(`/applicant/applications/${app?.id}`, { state: { app: app } });
    } else if (app?.status === stages[3].name.split("/")[1]) {
      toast.error("Unfortunately your application was declined");
    } else if (app?.status === stages[3].name.split("/")[0]) {
      toast.success("Congratulation!! \nYou have been hired");
    } else {
      onPrompt("Awaiting Employer's action");
    }
  };

  useEffect(() => {
    getJobById(app?.job_id, setJob);
  }, []);

  return (
    <div
  onClick={handleClick}
  className="flex justify-between items-center text-left gap-6 border-b py-4 px-3 hover:bg-gray-100 transition duration-200 ease-in-out cursor-pointer min-w-max"
>
  {/* Index */}
  <div className="w-40 flex gap-x-2 items-center text-gray-700 font-semibold">
    {index + 1}

  {/* Job Info */}
  <div className="flex items-center gap-2">
    <img
      src={`${resourceUrl}/${job?.featured_image}`}
      alt="Job"
      className="w-10 h-10 object-cover flex-shrink-0 rounded-full border border-gray-200 shadow-sm"
    />
    <p className="font-medium text-gray-800 text-sm break-words capitalize">{app?.job_title}</p>
  </div>
  </div>

  {/* Office Address */}
  <div className="w-32">
    <p className="text-gray-600 text-sm truncate" title={job?.office_address}>
      {job?.office_address || "N/A"}
    </p>
  </div>

  {/* Date Created */}
  <div className="text-gray-700 text-sm min-w-max">
    {dateCreated.toDateString()}
  </div>

  {/* Status */}
  <div className="w-32">
    <button
      className={`border px-4 py-1 text-xs rounded-full uppercase font-semibold ${getBorderColor()}`}
    >
      {FormatTextToUppecase(app?.status)}
    </button>
  </div>
</div>

  );
};

export default AllApplicants;
