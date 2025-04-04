import { createContext, useState, useMemo } from "react";

export const CompanyRouteContext = createContext();


export const CompanyRouteContextProvider = ({ children, setSideBar }) => {
 
  const [globalDetails, setGlobalDetails] = useState({});

  const contextValue = useMemo(() => ({
    globalDetails,
    setGlobalDetails, // ✅ Provide setGlobalDetails here
    setSideBar
  }), [globalDetails]);

  return (
    <CompanyRouteContext.Provider value={contextValue}>
      {children}
    </CompanyRouteContext.Provider>
  );
};
