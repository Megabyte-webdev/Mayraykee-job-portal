import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContex";
import { axiosClient } from "../../services/axios-client";
import TableHead from "./marketplace/TableHead";
import TableRow from "./marketplace/TableRow";
import { onFailure } from "../../utils/notifications/OnFailure";
import { useLocation } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6"
import { extractErrorMessage } from "../../utils/formmaters";
function ContractHistory() {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails.token);
  const location = useLocation();
  const { data } = location?.state ? location?.state : { data: null };
  const [contractItems, setContractItems] = useState([]);
  const getContractItems = async () => {
    const type = data.type;
    try {
      const { data } = await client.post("/contracts/details", {
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
      });

      if (data?.contracts) {
        setContractItems(
          !type ? data.contracts : data.contracts.filter(
            (current) => current.staff_category === type
          )
        );
      } else {
        setContractItems([]);
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      if (errorMessage !== "Contract(s) not found") {
        onFailure({
          message: "Something went wrong",
          error: errorMessage,
        });
      }
    }
  };

  useEffect(() => {
    getContractItems();
  }, [data]);
  return (
    <div className="h-full w-full flex flex-col py-5 gap-[15px]">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="w-max flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
      >
        <FaArrowLeftLong className="me-4 text-green-500" />Back
      </button>
      <span>Here is a detailed track record of all your contract history.</span>
      <TableHead>
        {contractItems.length > 0 &&
          contractItems
            .filter((current) => current.middle_name)
            .reverse()
            .map((current, index) => (
              <TableRow key={current.id + index} data={current} />
            ))}
      </TableHead>
    </div>
  );
}

export default ContractHistory;
