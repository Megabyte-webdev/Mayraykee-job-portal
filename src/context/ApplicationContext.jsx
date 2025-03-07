import { createContext, useState } from "react";
import useApplicationManagement from "../hooks/useApplicationManagement";

export const ApplicationContext = createContext();

export const ApplicationContextProvider = ({ children }) => {
  const {
    loading,
    applicants,
    interviewDetails,
    setInterviewDetails,
    resume,
    jobApplications,
    scheduleInterview,
    onTextChange,
    getApplicantsByEmployee,
    getApplicant,
    getResume,
    getJobApplications,
    getCompany
  } = useApplicationManagement();

  //Application specific to the applicant being inteviews
  const [application, setApplication] = useState(null)

  return (
    <ApplicationContext.Provider
      value={{
        loading,
        applicants,
        interviewDetails,
        setInterviewDetails,
        resume,
        application,   
        jobApplications,     
        scheduleInterview,
        onTextChange,
        getApplicantsByEmployee,
        getApplicant,
        getResume,
        setApplication,
        getJobApplications,
        getCompany
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
