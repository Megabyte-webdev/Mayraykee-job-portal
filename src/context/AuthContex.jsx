import { createContext, useEffect, useState } from "react";
import { addMinutes } from "date-fns";

export const AuthContext = createContext();

export const STORAGE_KEY = "__auth_details";

export const AuthContextProvider = ({ children }) => {
  // Retrieve session details with expiration check
  const getStoredAuth = () => {
    const sessionData = sessionStorage.getItem(STORAGE_KEY);

    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      if (new Date().getTime() < parsedData.expiry) {
        return parsedData.data;
      } else {
        sessionStorage.removeItem(STORAGE_KEY); // Clear expired session
        return null;
      }
    }
    return null;
  };

  const [authDetails, setAuthDetails] = useState(getStoredAuth());

  // Function to save session securely in sessionStorage
  const saveSession = () => {
    const expiryDate = addMinutes(new Date(), 30).getTime(); // Set expiry to 30 minutes

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ data: authDetails, expiry: expiryDate })
    );
  };

  useEffect(() => {
    if (authDetails) {
      saveSession();
    }
  }, [authDetails]);

  return (
    <AuthContext.Provider value={{ authDetails, setAuthDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
