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
      <div className="w-full flex flex-col px-3 md:px-8 min-h-full mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full min-h-[30%] bg-gray-50 p-6 rounded-lg shadow-md">
          {/* Employer Information */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-lg font-semibold text-gray-700 mb-4">Employer Information</h1>

            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col">
                <span className="p-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-t-md">
                  Full Name
                </span>
                <span className="p-2 text-gray-800 bg-white border border-gray-200 rounded-b-md">
                  {currentExclusive.name}
                </span>
              </div>

              <div className="w-full flex flex-col">
                <span className="p-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-t-md">
                  Email
                </span>
                <span className="p-2 text-gray-800 bg-white border border-gray-200 rounded-b-md break-all">
                  {currentExclusive.email}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/admin-exclusives/profile/${currentExclusive.id}`)}
              className="mt-4 py-2 px-4 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50"
            >
              Show Profile
            </button>
          </div>

          {/* Company Information */}
          {currentExclusive.employer && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h1 className="text-lg font-semibold text-gray-700 mb-4">Company Information</h1>

              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-col">
                  <span className="p-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-t-md">
                    Company Name
                  </span>
                  <span className="p-2 text-gray-800 bg-white border border-gray-200 rounded-b-md">
                    {currentExclusive.employer.company_name}
                  </span>
                </div>

                <div className="w-full flex flex-col">
                  <span className="p-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-t-md">
                    Email Address
                  </span>
                  <span className="p-2 text-gray-800 bg-white border border-gray-200 rounded-b-md break-all">
                    {currentExclusive.employer.email}
                  </span>
                </div>

                <div className="w-full flex flex-col">
                  <span className="p-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-t-md">
                    Phone Number
                  </span>
                  <span className="p-2 text-gray-800 bg-white border border-gray-200 rounded-b-md">
                    {currentExclusive.employer.phone_number}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>


        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
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

          <div className="rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col justify-between gap-4 p-4 hover:scale-[102%] transition-transform duration-300">
            <span className="text-green-700 text-xl font-semibold">Actions</span>

            <div className="flex flex-col gap-3">
              <button
                onClick={toogleJobModal}
                className="text-md py-2 font-medium rounded-lg bg-green-600 hover:bg-green-700 transition duration-200 w-full text-white"
              >
                Add Job
              </button>
              <button
                onClick={toogleProfileUpdate}
                className="text-md py-2 font-medium rounded-lg bg-green-600 hover:bg-green-700 transition duration-200 w-full text-white"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </ul>


        <div className="flex flex-col gap-3">
          <span className="text-lg font-semibold">
            List of {selectedCard.id === 2 ? `Applicants` : "Jobs"}
          </span>
          <div className="overflow-x-auto">
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
                    exclusiveData={currentExclusive}
                    isExclusive={true}
                  />
                ))}
              {selectedCard.id === 3 &&
                jobs.map((current) => {
                  const jobApplicants = applicants?.filter(
                    (currentApplicant) => current.id === currentApplicant.job_id
                  )
                  return (
                    <ListingRow
                      key={currentExclusive.id}
                      applicants={jobApplicants}
                      data={current}
                      isExclusive={true}
                    />)
                })}
            </TableWrap>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleExclusive;
