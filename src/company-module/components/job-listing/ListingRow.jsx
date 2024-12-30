import { useNavigate } from "react-router-dom";

function ListingRow({ data, applicants, isExclusive = false }) {
  const navigate = useNavigate();

  const navigateJobTypeDetails = () => {
    if (isExclusive) {
      navigate(`/admin-exclusives/job/${data.id}`, {
        state: { data: data, applicants: applicants },
      });
      return;
    } else {
      navigate(`/company/job-listing/type/${data.id}`, {
        state: { data: data, applicants: applicants },
      });
    }
  };

  return (
    <tr
      onClick={navigateJobTypeDetails}
      className="border-b cursor-pointer odd:bg-[#e7efe6] odd:text-black   hover:bg-green-200  text-gray-700  text-little"
    >
      <td className="text-center py-[5px]">
        <div className="flex justify-center font-semibold items-center gap-[5px]">
          <span>{data.job_title}</span>
        </div>
      </td>

      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <button className="py-[2px] px-[5px] border w-[80%] text-little border-primaryColor rounded-[30px] text-center font-semibold">
            {(data?.status === "approved" || data?.status === "1") ? "Open" :"Closed"}
          </button>
        </div>
      </td>

      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <span className="text-little font-semibold">
            {new Date(data.created_at).toLocaleDateString()}
          </span>
        </div>
      </td>

      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <span className="text-little font-semibold">
            {new Date(data.application_deadline_date).toLocaleDateString()}
          </span>
        </div>
      </td>

      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <button className="py-[2px] px-[5px] min-w-[80%] text-little border border-primaryColor rounded-[30px] text-center font-semibold">
            {data?.type}
          </button>
        </div>
      </td>

      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <span className="text-little font-semibold">
            {applicants.length > 0 ? applicants.length : "None"}
          </span>
        </div>
      </td>
      <td>
        <div className="flex w-full justify-center py-[10px] items-center">
          <span className="text-little font-semibold">
            {data?.gender?.toLowerCase() !== "any"
              ? data.gender
              : "Not A Criteria"}
          </span>
        </div>
      </td>
    </tr>
  );
}

export default ListingRow;
