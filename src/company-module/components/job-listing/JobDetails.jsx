import blueTickIcon from "../../../assets/pngs/blue-tick-icon.png";
import { job_dummies } from "../../../utils/dummies";
import { FormatPrice } from "../../../utils/formmaters";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useEffect, useState } from "react";
import Switch from "../../../components/DefaultSwitch";
import { useNavigate, useLocation } from "react-router-dom";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import DeleteDialog from "../../../components/DeleteDialog";
import DefaultSwitch from "../../../components/DefaultSwitch";
import AddJobModal from "../../../admin-exclusive-module/components/modals/AddJobModal";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import { resourceUrl } from "../../../services/axios-client";
import { IMAGE_URL } from "../../../utils/base";

function JobDetails({ data, jobUtils, applicants, exclusive }) {
  const location = useLocation();
  const { updateStatus } = UseAdminManagement();
  const [enabled, setEnabled] = useState(null);
  const [addJob, setAddJob] = useState(false);
  const [isDeleteOpen, setIsDeleteOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
console.log(data)
  const navigate = useNavigate();
  const toogleJobModal = () => setAddJob(!addJob);
  const handleEdit = () => {
    if (exclusive) {
      navigate(location.pathname, { state: { details: data } });
      toogleJobModal();
    } else {
      navigate("/company/job-posting", { state: { details: data } });
      scrollTo(0, 0)
    }

  }
  const handleDelete = () => {
    jobUtils.deleteJob(() => {
      onSuccess({
        message: "Delete Job",
        success: "Job deleted successfully",
      });
      window.history.back();

    }, data.id);
  };
  const handleStatusToggle = async () => {
    setIsLoading(true); // Start loading
    const newStatus = !enabled ? "approved" : "pending";
    const formData = {
      id: data.id,
      status: newStatus,
      type: "job"
    };
    const res = await jobUtils.deactivateJob(formData)
    onSuccess({
      message: "Status Updated",
      success: `Job is now ${enabled ? "closed" : "open"}`,
    });
    setIsLoading(false); // Stop loading
    setEnabled(!enabled); // Toggle the switch state
    window.history.back();
  };
  useEffect(() => {
    setEnabled(data?.status === "1" || data?.status === "approved");
  }, [data?.status]);

  return (
    <>
      <AddJobModal
        toogleJobModal={toogleJobModal}
        isOpen={addJob}
        exclusive={exclusive}
      />
      <DeleteDialog
        isOpen={isDeleteOpen}
        loading={jobUtils?.loading}
        setIsOpen={setIsDeleteOpened}
        title="Job"
        handleDelete={handleDelete}
      />

      <div className="p-2 flex flex-col w-full gap-4">
        <div className="w-full border flex flex-col md:flex-row justify-between px-2 py-1 items-center">
          <div className="flex gap-3 items-center w-full md:w-auto">
            <div className="h-12 w-12 bg-gray-300" >
              <img src={`${resourceUrl}${data?.featured_image}`} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col">
              <h3 className="font-bold text-lg">{data.job_title}</h3>
              <span className="text-sm">
                Mail to:{" "}
                <a
                  href={`mailto:${data.email}`}
                  className="text-primaryColor cursor-pointer hover:underline"
                >
                  {data.email}
                </a>
              </span>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex items-center gap-2 mt-2 md:mt-0">
            <button
              onClick={() => setIsDeleteOpened(true)}
              className="px-1 py-1 flex text-sm border items-center justify-center gap-1 w-1/2 md:w-20"
            >
              <MdDeleteForever className="text-red-600" />
              Delete
            </button>
            <button onClick={handleEdit} className="px-1 py-1 flex text-sm border items-center justify-center gap-1 w-1/2 md:w-20">
              <CiEdit className="text-primaryColor" />
              Edit
            </button>
            {data?.status === "pending" || data?.status === "approved" ?<DefaultSwitch
              enabled={enabled}
              setEnabled={setEnabled}
              loading={isLoading}
              onClick={handleStatusToggle}
            />: <strong className="text-red-500 uppercase text-xs">{data?.status === "suspend" ?"suspended": data?.status}</strong>}
          </div>
        </div>

        <div className="w-full text-black flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-3/5 flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="font-bold text-md">Job Description</span>
              <div
                dangerouslySetInnerHTML={{ __html: data?.job_description }}
                className="text-sm border border-dotted p-2"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-md">Experience Needed</span>
              <div
                dangerouslySetInnerHTML={{ __html: data?.experience }}
                className="text-sm"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-md">
                Qualifications and Skills
              </span>
              <ul className="flex flex-col gap-2 text-sm">
                {data?.qualification?.map((current, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <img src={blueTickIcon} className="h-4" alt="tick icon" />
                    <span>{current}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-2 border-t">
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Office Address</span>
                <span className="text-sm">{data?.office_address}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Intro Video URL</span>
                <span className="text-sm text-primaryColor hover:underline cursor-pointer">
                  {data?.introduction_video_url}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">External URL</span>
                <a className="text-sm text-primaryColor hover:underline cursor-pointer">
                  {data?.external_url}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-2/5 pr-2">
            <div className="flex flex-col">
              <span className="font-semibold text-md">About this Role</span>
              <div className="text-sm gap-2 flex flex-col">
                <span className="font-semibold p-2 bg-gray-100 text-center">
                  {applicants?.length} Applied
                </span>
                <span className="flex justify-between border-b border-dashed">
                  Job Posted on{" "}
                  <span>
                    {new Date(data?.created_at).toLocaleDateString()}
                  </span>
                </span>
                <span className="flex justify-between border-b border-dashed">
                  Job Deadline{" "}
                  <span>
                    {new Date(data?.application_deadline_date).toLocaleDateString()}
                  </span>
                </span>
                {/* Additional job details */}
              </div>
            </div>

            <div className="h-px bg-gray-300 w-full" />

            <div className="flex flex-col">
              <span className="font-semibold text-md">Search Keywords</span>
              <div className="grid grid-cols-2 gap-2">
                {data?.search_keywords?.split(",").map((keyword, index) => (
                  <span
                    key={index}
                    className="text-sm py-1 px-2 text-amber-500 bg-amber-300 rounded-full text-center"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-300 w-full" />

            <div className="flex flex-col">
              <span className="font-semibold text-md">Socials</span>
              <div className="grid grid-cols-2 gap-2">
                {data?.qualification?.map((current, index) => (
                  <span
                    key={index}
                    className="text-sm py-1 px-2 text-green-400 bg-green-200 rounded-full text-center"
                  >
                    {current}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobDetails;
