import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../services/axios-client";
import { set, get, del, keys } from "idb-keyval";
import { FormatError } from "../utils/formmaters";
import { AuthContext } from "../context/AuthContex";
import { onFailure } from "../utils/notifications/OnFailure";

export const COMPANY_PROFILE_Key = "Company Profile Database";

function useInterviewManagement() {
  const { authDetails } = useContext(AuthContext);
  const [error, setError] = useState({
    message: '',
    error: ''
  })

  const retrievalState = {
    init: 1,
    notRetrieved: 2,
    retrieved: 3,
  };

  const client = axiosClient(authDetails?.token, true);

  const [loading, setLoading] = useState(false);

  const [interviews, setInterviews] = useState([])

  //Api request to update profile
  const getAllInterviews = async (handleSuccess) => {
    if (authDetails?.token !== null || authDetails?.token !== undefined) {
      setLoading(true);
      try {
        const { data } = await client.get(`/interviews/getByEmployerId/${authDetails.user.id}`);
        setInterviews(data.interview)
        handleSuccess();
      } catch (error) {
       // console.log(error);
        // FormatError(error, setError, "Update Error");
      } finally {
        setLoading(false);
      }
    }
  };
//Api request to update profile
const getAllExclusiveInterviews = async (handleSuccess) => {
  if (authDetails?.token !== null || authDetails?.token !== undefined) {
    setLoading(true);
    try {
      const { data } = await client.get(`/interviews?user_type=exclusive`);
      return data.interviews?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
    } catch (error) {
     // console.log(error);
      // FormatError(error, setError, "Update Error");
    } finally {
      setLoading(false);
    }
  }
};
const getApplicantByExclusive = async (id) => {
  try {
    const response = await client(
      `getEmployerApply/${id}`
    );
    if (response.data.job_application) {
      return response.data.job_application.reverse();
    }
    return [];
  } catch (error) {
    onFailure({
      message: "Employers error",
      error: "Error retrieving Applicants",
    });
    return []
  }
};
const getEmployerById = async (id) => {
  try {
    setLoading(true);
    const response = await client.get(`/employer/getEmployer/${id}`);
    //console.log(response?.data)
    return response.data;
    
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};
const getCandidateById = async (id) => {
  try {
    setLoading(true);
    const response = await client.get(`/candidate/getCandidate/${id}`);
    return response.data.details;
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
}

  // useEffect(() => {
  //   if (error.message && error.error) {
  //     onFailure(error);
  //   }
  // }, [error.message, error.error]);

  // useEffect(() => {
  //   const initValue = async () => {
  //     try {
  //       const storedValue = await get(COMPANY_PROFILE_Key);
  //       if (storedValue !== undefined) {
  //         setDetails({
  //           ...storedValue,
  //           beenRetreived: retrievalState.retrieved,
  //         });
  //       } else {
  //         await getProfileInfo();
  //       }
  //     } catch (error) {
  //       FormatError(error, setError, "Index Error");
  //     }
  //   };

  //   initValue();
  // }, []);

  return {
    interviews,
    getAllInterviews,
    getAllExclusiveInterviews,
    getEmployerById,
    getCandidateById,getApplicantByExclusive
  };
}

export default useInterviewManagement;
