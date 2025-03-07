import { useNavigate } from "react-router-dom";
import { resourceUrl } from "../../../services/axios-client";

function ApplicantRow({ data }) {
  const navigate = useNavigate();

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
          <button className="py-1 px-3 uppercase text-xs border border-primaryColor rounded-full font-semibold truncate">
            {data?.status}
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
