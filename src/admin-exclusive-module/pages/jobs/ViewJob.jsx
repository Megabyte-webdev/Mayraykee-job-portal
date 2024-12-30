import { useLocation } from "react-router-dom";
import JobType from "../../../company-module/pages/job-listing/JobType";

function ViewJob() {
  const location = useLocation()

  const resource = location.state

  return (
    <div className="w-full h-full flex flex-col">
      <JobType resource={resource} test={true} />
    </div>
  );
}

export default ViewJob;
