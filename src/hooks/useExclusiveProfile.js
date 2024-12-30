import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContex";
import { onFailure } from "../utils/notifications/OnFailure";

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
        console.error("Unexpected format for data.details:", data.details);
        setDetails({ ...details, beenRetreived: retrievalState.notRetrieved });
      }
    } catch (error) {
      console.error("Error fetching profile info:", error);
      setDetails({ ...details, beenRetreived: retrievalState.retrieved });
    } finally {
      setLoading(false);
    }
  };

  //Function to map details to a form data
  const mapToFormData = () => {
    const formData = new FormData();
    Object.keys(details).map((current) => {
      const key = current;
      const val = details[current];
      if (val) {
        if (details.hasOwnProperty(key) && Array.isArray(val)) {
          if (val.length !== 0) {
            details[key].forEach((file) => {
              if (typeof file === "object") {
                formData.append(`${key}[]`, file);
              }
            });
          }
        } else {
          if (key === "logo_image" && typeof val === "string") {
            return;
          } else {
            formData.append(current, details[current]);
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
      handleSuccess();
    } catch (error) {
      console.log(error);
      // FormatError(error, setError, "Update Error");
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => console.log(details), [details]);
  useEffect(() => {
    if (error.message && error.error) {
      onFailure(error);
    }
  }, [error.message, error.error]);

  // useEffect(() => {
  //   //Initailise value from index db
  //   const initValue = async () => {
  //       await getProfile();
  //   };

  //   initValue();
  // }, []);

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
