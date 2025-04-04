import { useNavigate } from "react-router-dom";
import { resourceUrl } from "../../../services/axios-client";
import StatusCard from "../applicants/StatusCard";
import { stages } from "../../../utils/constants";
import { AiFillClockCircle } from "react-icons/ai";
import { MdCheckCircle } from "react-icons/md";
import { GiVideoConference } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";

function ApplicantRow({ data }) {
  const navigate = useNavigate();

  const getStatusComponent = () => {
    switch (data?.status) {
      case stages[0].name:
        return (
          <StatusCard
            name={data?.status}
            label={stages[0].label}
            icon={AiFillClockCircle}
            color={"bg-orange-500 text-white"}
            iconColor="text-white"
          />
        );
      case stages[1].name:
        return (
          <StatusCard
            name={data.status}
            label={stages[1].label}
            icon={MdCheckCircle}
            color={"bg-blue-500 text-white"}
            iconColor="text-white"
          />
        );
      case stages[2].name:
        return (
          <StatusCard
            name={data.status}
            label={stages[2].label}
            icon={GiVideoConference}
            color={"bg-yellow-500 text-black"}
            iconColor="text-blue-50"
          />
        );
      case stages[3].name.split("/")[0]:
        return (
          <StatusCard
            name={data.status}
            label={data.status}
            icon={MdCheckCircle}
            color={"bg-[#47AA49] text-white"}
            iconColor="text-blue-100"
          />
        );
      case stages[3].name.split("/")[1]:
        return (
          <StatusCard
            name={data.status}
            label={data.status}
            icon={IoMdCloseCircle}
            color={"bg-[#B22234] text-white"}
            iconColor="text-red-100"
          />
        );
      default:
        return "Not Found";
    }
  };

  const navigateToApplicantDetails = () =>
    navigate(`/company/applicants/detail/${data.id}`, { state: { data } });

  return (
    <tr className="border-b odd:bg-primaryColor/50 even:bg-white odd:text-white hover:bg-primaryColor/70 duration-100 text-sm">
      {/* Full Name */}
      <td className="text-center py-2 px-2 truncate">
        <div className="flex justify-center items-center gap-2">
          <span className="truncate">{data?.full_name}</span>
        </div>
      </td>

      {/* Email */}
      <td className="text-center py-2 px-2 truncate">
        <div className="flex justify-center items-center">
          <span className="truncate">{data?.email}</span>
        </div>
      </td>

      {/* Status */}
      <td className="text-center py-2 px-2">
        <div className="flex justify-center items-center">
          <button className="text-xs rounded-full font-semibold truncate">
            {getStatusComponent()}
          </button>
        </div>
      </td>

      {/* Date Created */}
      <td className="text-center py-2 px-2 truncate">
        <p className="font-semibold">
          {new Date(data?.created_at).toLocaleDateString()}
        </p>
      </td>

      {/* Job Title */}
      <td className="text-center py-2 px-2 truncate">
        <p>{data?.job_title}</p>
      </td>

      {/* Action Button */}
      <td className="text-center py-2 px-2">
        <div className="flex justify-center items-center">
          <button
            onClick={navigateToApplicantDetails}
            className="text-xs font-semibold bg-gray-800 text-white py-1 px-3 border border-white hover:bg-primaryColor hover:border-primaryColor"
          >
            See Application
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ApplicantRow;
