import { useContext } from "react";
import { AuthContext } from "../context/AuthContex";
import { axiosClient } from "../services/axios-client";
import { onFailure } from "../utils/notifications/OnFailure";

function useAdminExclusiveManagement(setDaboardSummary, setExclusives) {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails.token);

  //Retrievr all excluisves
  const getDashboardSummary = async () => {
    try {
      const { data } = await client.get(
        "getEmployerJobStats?user_type=exclusive"
      );
      setDaboardSummary({ ...data });
      return;
    } catch (error) {
      onFailure({
        message: "Employers error",
        error: "Error retrieving Employers",
      });
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


  const getJobsByExclusive = async (id) => {
    try {
      const response = await client.get(`/job-employer-id/${id}`);

      if (response.data) {
        return response.data.reverse();
      }
      return [];
    } catch (error) {
      onFailure({
        message: "Employers error",
        error: "Error retrieving Jobs",
      });
      return []
    }
  };

  const getAllExclusives = async () => {
    try {
      const { data } = await client.get("getEmployer");
      if (data) {
        const filtered = data.filter(
          (current) => current.user_type === "exclusive"
        ).reverse();
        setExclusives([...filtered]);
      }
      return;
    } catch (error) {
      onFailure({
        message: "Employers error",
        error: "Error retrieving Exclusives",
      });
    }
  };

  return { getDashboardSummary, getAllExclusives, getApplicantByExclusive, getJobsByExclusive };
}

export default useAdminExclusiveManagement;
