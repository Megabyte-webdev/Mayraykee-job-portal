import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formmaters";
function ListingRow({ data, applicants, isExclusive = false }) {
  const navigate = useNavigate();

  // Navigate to job details page based on exclusivity
  const navigateJobTypeDetails = () => {
    const path = isExclusive 
      ? `/admin-exclusives/job/${data.id}` 
      : `/company/job-listing/type/${data.id}`;

    navigate(path, {
      state: { data: data, applicants: applicants },
    });
  };

  
  return (
    <tr
      onClick={navigateJobTypeDetails}
      className="border-b cursor-pointer odd:bg-[#e7efe6] odd:text-black hover:bg-green-200 text-gray-700 text-little *:px-2"
    >
      {/* Job Title */}
      <td className="text-center py-[5px]">
        <div className="flex justify-center font-semibold items-center gap-[5px]">
          <span>{data.job_title?.length > 20 ? `${data.job_title?.slice(0,20)}...`: data.job_title}</span>
        </div>
      </td>

      {/* Job Status */}
      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <button className="py-[2px] px-[5px] border w-max text-little border-primaryColor rounded-[30px] text-center font-semibold">
            {(data?.status === "approved" || data?.status === "1") ? "Open" : "Closed"}
          </button>
        </div>
      </td>

      {/* Created At */}
      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <span className="text-little font-semibold">
            {formatDate(data.created_at)}
          </span>
        </div>
      </td>

      {/* Application Deadline */}
      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <span className="text-little font-semibold">
            {formatDate(data.application_deadline_date)}
          </span>
        </div>
      </td>

      {/* Job Type */}
      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <button className="py-[2px] px-[5px] w-max text-little border border-primaryColor rounded-[30px] text-center font-semibold">
            {data?.type}
          </button>
        </div>
      </td>

      {/* Applicants Count */}
      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <span className="text-little font-semibold">
            {applicants.length > 0 ? applicants.length : "None"}
          </span>
        </div>
      </td>

      {/* Gender Criteria */}
      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <span className="text-little font-semibold">
            {data?.gender?.toLowerCase() !== "any" ? data.gender : "Not A Criteria"}
          </span>
        </div>
      </td>
    </tr>
  );
}

export default ListingRow;
