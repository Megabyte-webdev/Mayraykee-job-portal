import { useState } from "react";
import {
  admin_exlusve_dummies,
  applicants_dummy,
  exclusives_table_head_dummies,
  job_dummies,
  job_dummy,
  job_table_head_dummies,
} from "../../../utils/dummies";
import SummaryCard from "../../components/SummaryCard";
import TableRow from "../../components/TableRow";
import TableWrap from "../../components/TableWrap";
import { useNavigate } from "react-router-dom";
import AddJobModal from "../../components/modals/AddJobModal";
import ListingRow from "../../../company-module/components/job-listing/ListingRow";
import ApplicantRow from "../../../company-module/components/applicants/ApplicantRow";

function SingleExclusive() {
  const navigate = useNavigate();
  const [selectedCard, setSelectCard] = useState(admin_exlusve_dummies[1]);
  const [addJob, setAddJob] = useState(false);

  const navigateToSingle = () => {
    if (selectedCard.id === admin_exlusve_dummies[1].id) {
      navigate("/admin-exclusives/applicant/1");
      return;
    } else {
      navigate("/admin-exclusives/job/1");
    }
  };

  const toogleJobModal = () => setAddJob(!addJob);

  return (
    <>
      <AddJobModal toogleJobModal={toogleJobModal} isOpen={addJob} />
      <div className="w-full flex flex-col px-10 min-h-full mt-5">
        <div className="grid grid-cols-2 justify-between items-center w-full min-h-[30%] bg-gray-50">
          <div className=" p-5 flex flex-col gap-2">
            <h1 className="text-md font-semibold text-gray-500">
              Employer Information
            </h1>

            <div className="w-full flex-col flex ">
              <span className="p-1 text-gray-500 bg-gray-100">Full Name</span>
              <span className="p-1">Example User</span>
            </div>

            <div className="w-full flex-col flex ">
              <span className="p-1 text-gray-500 bg-gray-100">
                Email Address
              </span>
              <span className="p-1">mr@example.com</span>
            </div>

            <div className="w-full flex-col flex ">
              <span className="p-1 text-gray-500 bg-gray-100">Phone Numbr</span>
              <span className="p-1">09035673994</span>
            </div>

            <span
              onClick={() => navigate("/admin-exclusives/profile")}
              className="text-green-500 cursor-pointer hover:underline"
            >
              Show Profile
            </span>
          </div>

          <div className=" p-5 flex flex-col gap-2">
            <h1 className="text-md font-semibold text-gray-500">
              Company Information
            </h1>

            <div className="w-full flex-col flex ">
              <span className="p-1 text-gray-500 bg-gray-100">
                Company Name
              </span>
              <span className="p-1">Example User</span>
            </div>

            <div className="w-full flex-col flex ">
              <span className="p-1 text-gray-500 bg-gray-100">
                Email Address
              </span>
              <span className="p-1">mr@example.com</span>
            </div>

            <div className="w-full flex-col flex ">
              <span className="p-1 text-gray-500 bg-gray-100">Phone Numbr</span>
              <span className="p-1">09035673994</span>
            </div>

          </div>

          <div className="w-[45%]"></div>
        </div>

        <ul className="w-full grid grid-cols-3 gap-4 my-8 ">
          {admin_exlusve_dummies
            .filter((current) => current.id !== 1)
            .map((current) => (
              <div onClick={() => setSelectCard(current)}>
                <SummaryCard key={current.id} {...current} />
              </div>
            ))}

          <div className=" rounded-md border cursor-pointer flex flex-col justify-between gap-5 p-3">
            <span className="text-green-700 text-md">Actions</span>

            <button
              onClick={toogleJobModal}
              className="text-md py-1 rounded-lg bg-green-500 hover:scale-[102%] w-[50%] px-5 text-white "
            >
              Add Job
            </button>
            <button className="text-md py-1 rounded-lg bg-green-500 hover:scale-[102%] w-[50%] px-5 text-white ">
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
                ? exclusives_table_head_dummies
                : job_table_head_dummies
            }
          >
            {selectedCard.id === 2 &&
              applicants_dummy.map((current) => (
                <ApplicantRow
                  key={current.key}
                  data={current}
                  isExclusive={true}
                />
              ))}
            {selectedCard.id === 3 && (
              <ListingRow
                key={job_dummy.id}
                applicants={applicants_dummy}
                data={job_dummy}
                isExclusive={true}
              />
            )}
          </TableWrap>
        </div>
      </div>
    </>
  );
}

export default SingleExclusive;
