import { createContext, useEffect } from "react";
import useInterviewManagement from "../hooks/useInterviewManagement";

export const InterviewContext = createContext();

export const InterviewContextProvider = ({ children }) => {
  const { getAllInterviews, interviews, getInterviewApplicant } = useInterviewManagement();

  useEffect(() => {
    getAllInterviews(() => {});
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        getAllInterviews,
        interviews,
        getInterviewApplicant
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
