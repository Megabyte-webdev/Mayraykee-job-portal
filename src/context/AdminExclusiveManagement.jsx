import { createContext, useEffect, useState } from "react";
import useAdminExclusiveManagement from "../hooks/useAdminExclusiveManagement";

export const AdminExclusiveManagementContext = createContext();

export const AdminExclusiveManagementContextProvider = ({ children }) => {
  const [dashboardSummary, setDashboardSummary] = useState([]);
  const [exclusives, setExclusives] = useState([]);

  const { getDashboardSummary, getAllExclusives, getApplicantByExclusive, getJobsByExclusive } = useAdminExclusiveManagement(
    setDashboardSummary,
    setExclusives
  );


  useEffect(() => {
    getDashboardSummary();
    getAllExclusives();
  }, []);
  return (
    <AdminExclusiveManagementContext.Provider
      value={{ getDashboardSummary,getAllExclusives, dashboardSummary, exclusives, getApplicantByExclusive,getJobsByExclusive }}
    >
      {children}
    </AdminExclusiveManagementContext.Provider>
  );
};
