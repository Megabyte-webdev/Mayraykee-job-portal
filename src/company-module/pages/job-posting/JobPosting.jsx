import { useEffect, useState } from "react";
import PostingHeader from "../../components/job-posting/PostingHeader";
import BasicInformation from "../../components/job-posting/BasicInformation";
import Descriptions from "../../components/job-posting/Descriptions";
import useJobManagement from "../../../hooks/useJobManagement";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { useLocation, useNavigate } from "react-router-dom";
const fields={
  featured_image: null,
    // job_title: "",
    // job_description: "",
    sector: "",
    type: "",
    search_keywords: "",
    job_apply_type: "",
    // external_url: "",
    gender: "",
    email: "",
    salary_type: "",
    min_salary: 0,
    max_salary: 10000,
    // experience: "",
    // career_level: "",
    currency: "",
    preferred_age: null,
    qualification: [],
    // introduction_video_url: "",
    application_deadline_date: "",
    office_address: "",
    location: "",
    maps_location: "",
    // number_of_participants: 10
}
const job_steps = [
  {
    id: 1,
    status: true,
    title: "Job Information",
  },
  {
    id: 2,
    status: false,
    title: "Job Description",
  },
];

function JobPosting({exclusive=null}) {
  const location= useLocation();
  const [currentStep, setCurrentStep] = useState(job_steps[0]);
  const [editJob, setEditJob] = useState(false);
  const jobUtils = useJobManagement();
  const navigate = useNavigate();


  const handleSuccess = () => {
   if(editJob){
    onSuccess({
      message: 'Update Job',
      success: 'Job Updated Successfully',
    });
   }else{
    onSuccess({
      message: 'New Job',
      success: 'Job Created Successfully',
    });
   }
  
    navigate('/company/job-listing');
  };
  const validateAndProceed = () => {
    try {
      const validationError = jobUtils.validateJobDetails(currentStep); // Pass currentStep here
      if (validationError) {
        throw new Error(validationError); // Throw error with descriptive message
      } else {
        // Proceed to next step if validation is successful
        const nextStep = job_steps.find((step) => step.id === currentStep.id + 1);
        if (nextStep) {
          setCurrentStep(nextStep);
        }
      }
    } catch (error) {
      // Notify user of validation or API errors
      console.log('Completion')
      onFailure({ message: "Complete this stage", error: error.message });
    }
  };
  

  useEffect(() => {
    console.log("Details", jobUtils.details);
  }, [jobUtils.details]);

  useEffect(()=>{
    console.log(location.state?.details)
    if(location.state?.details){
      jobUtils.setDetails(location.state?.details)
      setEditJob(true); 
    }
  },[location.state])

  return (
    <div className="py-2 px-5 md:px-8 lg:px-12 w-full h-full flex flex-col">
      <PostingHeader
        jobSteps={job_steps}
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
      />

      {currentStep.id === 1 && (
        <BasicInformation
          jobUtils={jobUtils}
          data={job_steps}
          setCurrentStep={setCurrentStep}
          validateAndProceed={validateAndProceed}
          editJob={editJob}
        />
      )}

      {currentStep.id === 2 && (
        <Descriptions
          jobUtils={jobUtils}
          data={job_steps}
          setCurrentStep={setCurrentStep}
          handleSuccess={handleSuccess}
          exclusive={exclusive}
          editJob={editJob}
        />
      )}
    </div>
  );
}

export default JobPosting;
