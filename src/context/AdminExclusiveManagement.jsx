import { createContext, useEffect, useState } from "react";
import useAdminExclusiveManagement from "../hooks/useAdminExclusiveManagement";

export const AdminExclusiveManagementContext = createContext();

export const AdminExclusiveManagementContextProvider = ({ children }) => {
  const [exclusives, setExclusives] = useState([]);

  const { getAllExclusives } = useAdminExclusiveManagement(setExclusives);

  useEffect(() => {
    getAllExclusives();
  }, []);
  return (
    <AdminExclusiveManagementContext.Provider value={{ getAllExclusives }}>
      {children}
    </AdminExclusiveManagementContext.Provider>
  );
};
