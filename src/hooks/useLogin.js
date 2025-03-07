import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { FormatError } from "../utils/formmaters";
import { onFailure } from "../utils/notifications/OnFailure";
import { AuthContext } from "../context/AuthContex";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { SessionContext } from "../context/SessionContext";
import {useNavigate} from 'react-router-dom'
import useRegistration from "./useRegistration";
import { resetTimer } from "../components/Auth/EmailVerification";
function useLogin(role) {
  const navigate=useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const { setAuthDetails } = useContext(AuthContext);
  const {saveSession} = useContext(SessionContext)
  const {resendOtp} =useRegistration()
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
        if(response?.data?.user?.staff_category !== role){
           throw new Error("User not found")
          return
        }
        setAuthDetails({
          token: response.data.token,
          user: response.data.user,
        });

      }
      onSuccess();
      saveSession()
    } catch (e) {
      console.log(e)
      // Format and display the error immediately
      FormatError(e, setError, "Incomplete Registration");
      if (e?.response?.data?.message?.toLowerCase()?.includes("not verified")) {
        localStorage.setItem(
          "__reg_info",
          JSON.stringify({
            ...loginDetails,
            password: "__",
            re_enter_password: "__",
          })
        )
        console.log("complete registration");
      
        // Optional: Delay the confirmation box slightly to ensure UI updates
        setTimeout(() => {
          const userConfirmation = window.confirm(
            "Your registration is incomplete. Would you like to verify your email now?"
          );
      
          if (userConfirmation) {
            navigate("/registration/email_verification");
            resendOtp(resetTimer);
          } else {
            console.log("User chose to stay on the current page.");
          }
        }, 1000); // Adjust delay as needed
      }else{
        FormatError(e, setError, "Login Error");
      }
      
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
        success: "A reset otp has been sent to your email",
      });
      return true;
    } catch (error) {
      FormatError(error, setError, "Reset Error");
      return false
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
      navigate("/login");
    } catch (error) {
      FormatError(error, setError, "Reset Error");
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    //console.log(error)
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
