import { useContext, useEffect, useState } from "react";
import {
  admin_exlusve_dummies,
  applcants_table_head_dummies,
  job_table_head_dummies,
} from "../../../utils/dummies";
import SummaryCard from "../../components/SummaryCard";
import TableWrap from "../../components/TableWrap";
import { useLocation, useNavigate } from "react-router-dom";
import AddJobModal from "../../components/modals/AddJobModal";
import ListingRow from "../../../company-module/components/job-listing/ListingRow";
import ApplicantRow from "../../../company-module/components/applicants/ApplicantRow";
import { AdminExclusiveManagementContext } from "../../../context/AdminExclusiveManagement";
import UpdateExclusiveProfileModal from "../../components/modals/UpdateExclusiveProfileModal";

function SingleExclusive() {
  const navigate = useNavigate();
  const [selectedCard, setSelectCard] = useState(admin_exlusve_dummies[1]);
  const [addJob, setAddJob] = useState(false);
  const [profileUpdate, setProfileUpdate] = useState(false);
  const [profileInfo, setProfileInfo] = useState(false);
  const location = useLocation();
  const [currentExclusive, setCurrentExclusive] = useState(location.state.data);
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const { getApplicantByExclusive, getJobsByExclusive } = useContext(
    AdminExclusiveManagementContext
  );

  const navigateToSingle = () => {
    if (selectedCard.id === admin_exlusve_dummies[1].id) {
      navigate("/admin-exclusives/applicant/1");
      return;
    } else {
      navigate("/admin-exclusives/job/1");
    }
  };

  const toogleJobModal = () => setAddJob(!addJob);
  const toogleProfileUpdate = () => setProfileUpdate(!profileUpdate);
  const toogleProfileInfoModal = () => setProfileUpdate(!profileUpdate);

  // console.log(currentExclusive);

  useEffect(() => {
    const initData = async () => {
      const jobsList = await getJobsByExclusive(currentExclusive.id);
      const applicantsList = await getApplicantByExclusive(currentExclusive.id);
      setApplicants([...applicantsList]);
      setJobs([...jobsList]);
    };

    initData();
  }, []);

  return (
    <>
      <AddJobModal
        toogleJobModal={toogleJobModal}
        isOpen={addJob}
        exclusive={currentExclusive}
      />
      {currentExclusive && (
        <UpdateExclusiveProfileModal
          toogleProfileUpdateModal={toogleProfileUpdate}
          isOpen={profileUpdate}
          exclusive={currentExclusive}
        />
      )}
      <div className="w-full flex flex-col px-10 min-h-full mt-5">
        <div className="grid grid-cols-2 justify-between items-center w-full h-full min-h-[30%] bg-gray-50">
          <div className=" p-5 flex flex-col gap-2">
            <h1 className="text-md font-semibold text-gray-500">
              Employer Information
            </h1>

            <div className="w-full flex-col flex ">
              <span className="p-1 text-gray-500 bg-gray-100">Full Name</span>
              <span className="p-1">{currentExclusive.name}</span>
            </div>

            <div className="w-full flex-col flex ">
              <span className="p-1 text-gray-500 bg-gray-100">Email</span>
              <span className="p-1">{currentExclusive.email}</span>
            </div>

            <span
              onClick={() => navigate(`/admin-exclusives/profile/${currentExclusive.id}`)}
              className="text-green-500 cursor-pointer hover:underline"
            >
              Show Profile
            </span>
          </div>

          {currentExclusive.employer && (
            <div className=" p-5 flex flex-col gap-2">
              <h1 className="text-md font-semibold text-gray-500">
                Company Information
              </h1>

              <div className="w-full flex-col flex ">
                <span className="p-1 text-gray-500 bg-gray-100">
                  Company Name
                </span>
                <span className="p-1">
                  {currentExclusive.employer.company_name}
                </span>
              </div>

              <div className="w-full flex-col flex ">
                <span className="p-1 text-gray-500 bg-gray-100">
                  Email Address
                </span>
                <span className="p-1">{currentExclusive.employer.email}</span>
              </div>

              <div className="w-full flex-col flex ">
                <span className="p-1 text-gray-500 bg-gray-100">
                  Phone Number
                </span>
                <span className="p-1">
                  {currentExclusive.employer.phone_number}
                </span>
              </div>
            </div>
          )}

          <div className="w-[45%]"></div>
        </div>

        <ul className="w-full grid grid-cols-responsive3 lg:grid-cols-3 gap-4 my-8 ">
          {admin_exlusve_dummies
            .filter((current) => current.id !== 1)
            .map((current) => {
              const value = current.id === 2 ? applicants.length : jobs.length;
              return (
                <div key={current?.id} onClick={() => setSelectCard(current)}>
                  <SummaryCard key={current.id} {...current} value={value} />
                </div>
              );
            })}

          <div className=" rounded-md border cursor-pointer flex flex-col justify-between gap-5 p-3">
            <span className="text-green-700 text-md">Actions</span>

            <button
              onClick={toogleJobModal}
              className="text-md py-1 rounded-lg bg-green-500 hover:scale-[102%] w-[50%] px-5 text-white "
            >
              Add Job
            </button>
            <button
              onClick={toogleProfileUpdate}
              className="text-md py-1 rounded-lg bg-green-500 hover:scale-[102%] w-[50%] px-5 text-white "
            >
              Edit Profile
            </button>
          </div>
        </ul>

        <div className="flex flex-col gap-3">
          <span className="text-lg font-semibold">
            List of {selectedCard.id === 2 ? `Applicants` : "Jobs"}
          </span>
          <TableWrap
            rows={
              selectedCard.id === 2
                ? applcants_table_head_dummies
                : job_table_head_dummies
            }
          >
            {selectedCard.id === 2 &&
              applicants.map((current) => (
                <ApplicantRow
                  key={current.key}
                  data={current}
                  isExclusive={true}
                />
              ))}
            {selectedCard.id === 3 &&
              jobs.map((current) => (
                <ListingRow
                  key={currentExclusive.id}
                  applicants={applicants}
                  data={current}
                  isExclusive={true}
                />
              ))}
          </TableWrap>
        </div>
      </div>
    </>
  );
}

export default SingleExclusive;
