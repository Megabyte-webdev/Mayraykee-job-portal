import { useEffect, useState } from "react";
import Header from "../../components/job-listing/Header";
import Applicants from "../../components/job-listing/Applicants";
import JobDetails from "../../components/job-listing/JobDetails";
import { useLocation, useParams } from "react-router-dom";
import { JobContext } from "../../../context/JobContext";
import { useContext } from "react";
import { ApplicationContext } from "../../../context/ApplicationContext";
import useJobManagement from "../../../hooks/useJobManagement";

const options = [
  {
    id: 1,
    name: "Applicants",
  },
  {
    id: 2,
    name: "Job Details",
  },
];

function JobType({test = false, resource = null}) {
  const [currentOption, setCurrentOption] = useState(options[0]);
  const jobUtils = useJobManagement();
  const { applicants } = useContext(ApplicationContext);
  const { id } = useParams();
  const [currentJob, setCurrentJob] = useState([]);
  const location = useLocation();
  const [allApplicants, setAllApplicants] = useState([]);

  const getComponent = () => {
    switch (currentOption.id) {
      case options[0].id:
        return <Applicants data={currentJob} applicants={allApplicants} />;
      case options[1].id:
        return <JobDetails data={currentJob} jobUtils={jobUtils} applicants={allApplicants} />;
    }
  };

  
 
  useEffect(() => {
    console.log(test)
    console.log(location?.state)
    if(!test){
      if (location?.state?.data !== null) {
        setCurrentJob(location?.state?.data);
        
      } else {
        console.log(jobUtils.jobList);
        jobUtils.getJobById(id, setCurrentJob);
      }
  
      if (location?.state?.applicants) {
        setAllApplicants(location.state.applicants);
      } else {
        const currentApplicants = applicants.find(
          (current) => current.job_id === Number(id)
        );
        setAllApplicants(currentApplicants);
      }
    } else{
      if (resource?.data !== null) {
        setCurrentJob(location?.state?.data);
      } else {
        console.log(jobUtils.jobList);
        jobUtils.getJobById(id, setCurrentJob);
      }
  
      if (resource?.applicants) {
        setAllApplicants(resource.applicants);
      } else {
        const currentApplicants = applicants.find(
          (current) => current.job_id === Number(id)
        );
        setAllApplicants(currentApplicants);
      }
    }
  }, []);
  
  return (
    currentJob && (
      <>
        <div className="w-full px-4 md:px-8 lg:px-12 py-5 flex flex-col gap-[20px]">
          <Header
            applicants={allApplicants || []}
            options={options}
            currentOption={currentOption}
            setCurrentOption={setCurrentOption}
            job={currentJob}
          />

          {allApplicants && getComponent()}
        </div>
      </>
    )
  );
}

export default JobType;
