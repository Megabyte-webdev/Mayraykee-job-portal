import { useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { FormatError } from "../utils/formmaters";
import { onFailure } from "../utils/notifications/OnFailure";

function useRegistration(role) {
  const [regDetails, setRegDetails] = useState({
    first_name: "",
    surname: "",
    role: role,
    email: "",
    password: "",
    re_enter_password: "",
  });

  const [staffsRegDetails, setStaffsRegDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_enter_password: "",
    staff_category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    error: "",
  });
  const [] = useState();

  const client = axiosClient();

  const onTextChange = (e) => {
    const { name, value } = e.target;
    setRegDetails({ ...regDetails, [name]: value });
  };

  const onTextChangeStaff = (e) => {
    const { name, value } = e.target;
    setStaffsRegDetails({ ...staffsRegDetails, [name]: value });
  };

  const registerStaff = async (subcategory, onSuccess, staff) => {
    setLoading(true);
    try {
      if (regDetails.password !== regDetails.re_enter_password)
        throw Error("Password Mismatch");
      if (!subcategory?.name)
        throw Error("Please select a category");
      await client.post(`/domesticStaff/register`, {
        ...staffsRegDetails,
        subcategory: subcategory.name,
        staff_category: staff,
      });
      onSuccess();
    } catch (e) {
      FormatError(e, setError, "Registration Error");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (gender, onSuccess) => {
    setLoading(true);
    
    try {
      if (!gender?.name)
        throw Error("Please select your gender");
      const detail =
        regDetails.role === "candidate"
          ? { ...regDetails, gender: gender?.name }
          : {
              name: `${regDetails.first_name} ${regDetails.last_name}`,
              gender: gender.name,
              ...regDetails,
            };

      if (regDetails.password !== regDetails.re_enter_password)
        throw Error("Password Mismatch");

      const response = await client.post(`/${regDetails.role}/NewUser`, detail);
      onSuccess();
    } catch (e) {
      FormatError(e, setError, "Registration Error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp, onSuccess) => {
    setLoading(true);
    const regSessionDetails = JSON.parse(localStorage.getItem("__reg_info"));
    console.log("reg", regSessionDetails);
    try {
      const data = {
        email: regSessionDetails.email,
        otp: otp,
      };

      const dataCopy = JSON.parse(JSON.stringify(data));

      const response = await client.post(
        `/${regSessionDetails?.role || "domesticStaff"}/verifyOtp`,
        dataCopy
      );
      onSuccess();
    } catch (e) {
      FormatError(e, setError, "verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (resetTimer) => {
    setLoading(true);
    const regSessionDetails = JSON.parse(localStorage.getItem("__reg_info"));
    try {
      const data = {
        email: regSessionDetails.email,
      };

      const dataCopy = JSON.parse(JSON.stringify(data));

      const response = await client.post(
        `/${regSessionDetails.role}/resendOtp`,
        dataCopy
      );
      resetTimer();
    } catch (e) {
      FormatError(e, setError, "Otp Error");
    } finally {
      setLoading(false);
    }
  };

  //register exclusive
  const registerExclusive = async (onSuccess, formdata) => {
    setLoading(true);
    try {
      if (formdata.password !== formdata.re_enter_password)
        throw Error("Password Mismatch");

      const response = await client.post(`/employer/NewUser`, {
        ...formdata,
        role: "employer",
        user_type: "exclusive",
      });

      onSuccess();
    } catch (e) {
      FormatError(e, setError, "Registration Error");
    } finally {
    }
  };

  useEffect(() => {
    if (error.message && error.error) {
      onFailure(error);
    }
  }, [error]);

  useEffect(() => {
    setRegDetails({ ...regDetails, role: role });
  }, [role]);

  return {
    regDetails,
    staffsRegDetails,
    loading,
    onTextChange,
    onTextChangeStaff,
    registerUser,
    registerStaff,
    verifyOtp,
    resendOtp,

    // exclusive
    registerExclusive,
  };
}

export default useRegistration;
