import { createContext, useContext, useEffect, useState } from "react";
import { clear } from "idb-keyval";
import { useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { AuthContext } from "./AuthContex";

const SESSION_TIMEOUT = 1800000; // 30 minutes
const SESSION_KEY = "_session_condition";

export const SessionContext = createContext();

export const SessionContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);

  // Helper function to add days
  const addDays = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Retrieve session data from sessionStorage
  const storedSession = JSON.parse(sessionStorage.getItem(SESSION_KEY)) || {};
  const [rememberMe, setRememberMe] = useState(storedSession.status || false);
  const [expiryDate, setExpiryDate] = useState(storedSession.expiry_date ? new Date(storedSession.expiry_date) : null);

  const toggleRememberMe = () => setRememberMe(!rememberMe);

  const saveSession = () => {
    const sessionData = {
      status: rememberMe,
      expiry_date: rememberMe ? addDays(new Date(), 7) : null, // 7 days
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setExpiryDate(sessionData.expiry_date);
    console.log("Session saved.");
  };

  const redirectAuthUser = () => {
    if (!authDetails?.user?.role) return;
    console.log("Redirecting user...");
    switch (authDetails?.user?.role) {
      case "candidate":
        return navigate("/applicant");
      case "employer":
        return navigate("/company");
      case "staff":
        return navigate("/staff");
      default:
        return navigate("/");
    }
  };

  const onIdle = () => {
    if (!rememberMe && expiryDate && new Date(expiryDate) < new Date()) {
      sessionStorage.clear(); // Only clear session-related data
      clear();
      navigate("/");
      Please("Please login again");
    }
  };

  useIdleTimer({
    timeout: SESSION_TIMEOUT,
    onIdle,
  });

  return (
    <SessionContext.Provider value={{ toggleRememberMe, rememberMe, saveSession, redirectAuthUser }}>
      {children}
    </SessionContext.Provider>
  );
};
