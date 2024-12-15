import { useContext } from "react";
import { AuthContext } from "../context/AuthContex";
import { axiosClient } from "../services/axios-client";
import { onFailure } from "../utils/notifications/OnFailure";

function useAdminExclusiveManagement(setExclusives) {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails.token);

  //Retrievr all excluisves
  const getAllExclusives = async () => {
    try {
      const { data } = await client.get(`getEmployer`);
      if (data.employers) {
        setExclusives(data.employers);
      }
      return
    } catch (error) {
      onFailure({
        message: "Employers error",
        error: "Error retrieving Employers",
      });
    }
  };

  return { getAllExclusives };
}

export default useAdminExclusiveManagement;
