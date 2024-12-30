import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { FormatError } from "../utils/formmaters";
import { onFailure } from "../utils/notifications/OnFailure";
import { AuthContext } from "../context/AuthContex";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { SessionContext } from "../context/SessionContext";

function useLogin(role) {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const { setAuthDetails } = useContext(AuthContext);
  const {saveSession} = useContext(SessionContext)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    error: "",
  });
  const [] = useState();

  const client = axiosClient();

  const onTextChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const loginUser = async (onSuccess) => {
    setLoading(true);

    try {
      if (role === "candidate" || role == "employer" || role == "admin") {
        const response = await client.post(`/${role}/login`, loginDetails);
        setAuthDetails({
          token: response.data.token,
          user: response.data.user,
        });
      } else {
        const response = await client.post(`/domesticStaff/login`, {
          email: loginDetails.email,
          password: loginDetails.password,
        });
        setAuthDetails({
          token: response.data.token,
          user: response.data.user,
        });
      }
      onSuccess();
      saveSession()
    } catch (e) {
      console.log(e)
      FormatError(e, setError, "Registration Error");
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email, role) => {
    setLoading(true);
    try {
      if (!role) throw new Error("A role must be selected");

      const { data } = await client.post(`/${role}/forgotten-password`, {
        email,
      });
      onSuccess({
        message: "Reset succesful",
        success: "A reset otp has been sent to you email",
      });
    } catch (error) {
      FormatError(error, setError, "Reset Error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, password, otp, role) => {
    setLoading(true);
    try {
      if (!role) throw new Error("A role must be selected");
      if (!otp) throw new Error("Please enter OTP");
      if (!email) throw new Error("Email not found, please try again");

      const { data } = await client.post(`/${role}/setPassword`, {
        email,
        password,
        otp,
      });
      onSuccess({
        message: "Reset succesful",
        success: "Your passwod has been succesfull resetr",
      });
    } catch (error) {
      FormatError(error, setError, "Reset Error");
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    console.log(error)
    if (error.message || error.error) {
      onFailure(error);
    }
  }, [error]);

  useEffect(() => {
    setLoginDetails({ ...loginDetails, role: role });
  }, [role]);

  return {
    loginDetails,
    loading,
    onTextChange,
    loginUser,
    forgotPassword,
    resetPassword,
  };
}

export default useLogin;
