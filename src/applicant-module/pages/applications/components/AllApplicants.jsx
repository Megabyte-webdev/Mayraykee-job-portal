import React, { useState, useEffect } from "react";
import newApplicant from "../../../../assets/pngs/applicant-logo1.png";
import { MdMoreHoriz } from "react-icons/md";
import { stages } from "../../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { onPrompt } from "../../../../utils/notifications/onPrompt";
import { toast } from "react-toastify";
import useJobManagement from "../../../../hooks/useJobManagement";
import { resourceUrl } from "../../../../services/axios-client";
import { FormatTextToUppecase } from "../../../../utils/formmaters";

const AllApplicants = ({ app, index }) => {
  const dateCreated = new Date(app?.created_at);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const { getJobById } = useJobManagement();

  const getBorderColor = () => {
    switch (app?.status) {
      case stages[0].name:
        return "text-orange-500 border-lightorange";
      case stages[1].name:
        return "text-yellow-500 border-lightblue";
      case stages[2].name:
        return "text-darkblue border-darkblue";
      case stages[3].name.split("/")[0]:
        return "text-primaryColor border-primaryColor";
      case stages[3].name.split("/")[1]:
        return "text-[#8B0A1A] border-[#8B0A1A]";
    }
  };

  const handleClick = () => {
    if (app?.status === stages[1].name) {
      navigate(`/applicant/applications/${app.id}`, { state: { app: app } });
    } else if (app?.status === stages[3].name.split("/")[1]) {
      toast.error("Unfortunately your application was declined");
    } else if (app?.status === stages[3].name.split("/")[0]) {
      toast.success("Congratulation!! \nYou have been hired");
    } else {
      onPrompt("Awaiting Employer's action");
    }
  };

  useEffect(() => {
    getJobById(app.job_id, setJob);
  }, []);

  console.log("Job", job);

  return (
    <div
      onClick={handleClick}
      className="flex recent_added items-center min-w-full"
    >
      <div className="flex justify-between py-3 px-2 w-[25%]">
        <span>{index + 1}</span>
        <div className="w-3/4 flex items-center">
          <div>
            <img
              src={`${resourceUrl}/${job?.featured_image}`}
              width={"40px"}
              alt=""
            />
            <p className="">{app.job_title}</p>
          </div>
        </div>
      </div>
      <div className="flex py-3 px-2 w-3/6">
        <p className="w-[40%]">{job?.office_address}</p>
        <p className="w-[40%]">{dateCreated.toDateString()}</p>
      </div>
      <div className="flex justify-between py-3 px-2 w-[25%]">
        <div className="w-2/3">
          <button
            className={`border border-green-600 text-[12px] text-green-900 px-2 py-1 rounded-full uppercase ${getBorderColor()}`}
          >
            {FormatTextToUppecase(app.status)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllApplicants;
