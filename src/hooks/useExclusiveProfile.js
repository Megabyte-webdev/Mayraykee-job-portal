import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContex";
import { onFailure } from "../utils/notifications/OnFailure";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { FormatError } from "../utils/formmaters";
import { set, get, del, keys } from "idb-keyval";
export const COMPANY_PROFILE_Key = "Company Profile Database";

function useExclusiveProfile(exclusiveID) {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token, true);

  const retrievalState = {
    init: 1,
    notRetrieved: 2,
    retrieved: 3,
  };


  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState({
    //beenRetrieved check it data has instantialted
    beenRetreived: retrievalState.init,
    employer_id: exclusiveID,
    company_profile: "",
    logo_image: "",
    company_name: "",
    email: "",
    phone_number: "",
    website: "",
    year_of_incorporation: null,
    rc_number: "",
    company_size: "",
    sector: "",
    introduction_video_url: "",
    profile_url: "",
    company_campaign_photos: [],
    social_media: [],
    network: "",
    location: "",
    address: "",
  });

  const [error, setError] = useState({
    message: "",
    error: "",
  });

  const onTextChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const getProfile = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(
        `/employer/getEmployer/${details.employer_id}`
      );

      // Check and handle data.details safely
      if (
        data.details &&
        typeof data.details === "object" &&
        !Array.isArray(data.details)
      ) {
        console.log(data.details);
        setDetails(() => {
          const test = data.details;
          const neww = {
            ...test,
            beenRetreived: retrievalState.retrieved,
          };
          return neww
        });
      } else {
        console.error("Unexpected format for data.details:", data?.details);
        setDetails({ ...details, beenRetreived: retrievalState.notRetrieved });
      }
    } catch (error) {
      console.error("Error fetching profile info:", error);
      setDetails({ ...details, beenRetreived: retrievalState.retrieved });
    } finally {
      setLoading(false);
    }
  };

  const mapToFormData = () => {
    const formData = new FormData();
    
    Object.keys(details).forEach((current) => {
      const key = current;
      const val = details[current];
      
      if (val) {
        if (Array.isArray(val)) {
          // Append all values in the array, whether strings or files
          val.forEach((item) => {
            if (typeof item === "object") {
              // It's a file, append it
              formData.append(`${key}[]`, item);
            } else if (typeof item === "string") {
              // It's a string (existing path), append it
              formData.append(`${key}[]`, item);
            }
          });
        } else {
          if (key === 'logo_image' && typeof val === 'string') {
            // Skip existing logo image URL
            return;
          } else {
            formData.append(current, val);
          }
        }
      }
    });
  
    return formData;
  };
  


  //Api request to update profile
  const updateCompanyProfile = async (handleSuccess) => {
    setLoading(true);
    try {
      const data = mapToFormData();

      const response = await client.post(
        `/employer/UpdateEmployer/${details.employer_id}`,
        data
      );

      //On success, save response data to index db
   
      setDetails({...details, ...response.data?.employer})
      await set(COMPANY_PROFILE_Key, response.data?.employer);
      onSuccess({"message": "Profile Update", success:response?.message || "Successful"});
      handleSuccess();
    } catch (error) {
      console.log(error);
      onFailure({
        message: error?.message || "An error occurred",
        error: 
          typeof error?.response?.data?.message === "string"
            ? error?.response?.data?.message
            : Object.entries(error?.response?.data?.message || {})
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
                .join("\n"),
      });
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => console.log(details), [details]);
  useEffect(() => {
    if (error?.message && error?.error) {
      onFailure(error);
    }
  }, [error]);
useEffect(() => {
    //Initailise value from index db
    const initValue = async () => {
      try {
        //const storedValue = await get(COMPANY_PROFILE_Key);
        if (details.employer_id) {
          await getProfile();
        }
      } catch (error) {
        FormatError(error, setError, "Index Error");
      }
    };

    initValue();
  }, [details.employer_id]);

  return {
    loading,
    details,
    onTextChange,
    setDetails,
    updateCompanyProfile,
    getProfile,
    setDetails,
    retrievalState,
  };
}

export default useExclusiveProfile;
