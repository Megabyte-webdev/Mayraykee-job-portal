import SingleApplicant from "../../../company-module/pages/applicants/SingleApplicant";
import JobType from "../../../company-module/pages/job-listing/JobType";

function ViewApplicant() {
  return (
    <div className="w-full h-full flex flex-col px-2">
      <SingleApplicant exclusive={true} />
    </div>
  );
}

export default ViewApplicant;
