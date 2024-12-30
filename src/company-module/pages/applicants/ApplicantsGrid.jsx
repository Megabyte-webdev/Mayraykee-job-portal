import { MdCheckCircle } from "react-icons/md";
import { stages } from "../../../utils/constants";
import StatusCard from "../../components/applicants/StatusCard";
import { AiFillClockCircle } from "react-icons/ai";
import { GiVideoConference } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContex";

function ApplicateGridCard({ data }) {
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const role = authDetails?.user?.role === "employer" ? "company" : "applicant";

  const navigateToApplicantDetails = () => {
    navigate(`/${role}/applicants/detail/${data?.id}`, { state: { data } });
  };
//   console.log(data);

  const getStatusComponent = () => {
    switch (data?.status) {
      case stages[0].name:
        return (
          <StatusCard
            name={data?.status}
            icon={AiFillClockCircle}
            color={"bg-[#FFF6E9] text-red-300"}
            iconColor="text-red-300"
          />
        );
      case stages[1].name:
        return (
          <StatusCard
            name={data.status}
            icon={MdCheckCircle}
            color={"bg-[#164CA9] text-white"}
            iconColor="text-white"
          />
        );
      case stages[2].name:
        return (
          <StatusCard
            name={data.status}
            icon={GiVideoConference}
            color={"bg-[#FFCD68] text-black"}
            iconColor="text-blue-50"
          />
        );
      case stages[3].name.split("/")[0]:
        return (
          <StatusCard
            name={data.status}
            icon={MdCheckCircle}
            color={"bg-[#47AA49] text-white"}
            iconColor="text-blue-100"
          />
        );
      case stages[3].name.split("/")[1]:
        return (
          <StatusCard
            name={data.status}
            icon={IoMdCloseCircle}
            color={"bg-[#B22234] text-white"}
            iconColor="text-red-100"
          />
        );
      default:
        return "Not Found";
    }
  };
  return (
    <div className="flex flex-col rounded-md items-center border border-gray-400 p-5 gap-3">
      <span className="font-semibold text-green-800">{data.job_title}</span>

      <div className="flex w-full justify-between px-3 gap-2">
        <span className="text-gray-600 font-semibold">Full Name</span>
        <span>{data.full_name}</span>
      </div>

      <div className="flex w-full justify-between px-3 gap-2">
        <span className="text-gray-600 font-semibold">Email</span>
        <span>{data.email}</span>
      </div>

      <div className="flex w-full justify-between px-3 gap-2">
        <span className="text-gray-600 font-semibold">Phone</span>
        <span>{data.phone_number}</span>
      </div>

      <div className="flex w-full items-center justify-between px-3 gap-2">
        <span className="text-gray-600 font-semibold">Status</span>
        <span>{getStatusComponent()}</span>
      </div>

      <div className="flex w-full items-center justify-between px-3 gap-2">
        <span className="text-gray-600 font-semibold">Action</span>
        <span onClick={navigateToApplicantDetails} className="hover:underline hover:text-primaryColor cursor-pointer">
          View Application
        </span>
      </div>
    </div>
  );
}

export default ApplicateGridCard;
