import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContex";
import { axiosClient } from "../../../services/axios-client";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import { useLocation } from "react-router-dom";

const navOptions = ["Active Contracts", "Market Place"];

function MarketPlace({handleAddToCart}) {
  const location = useLocation();
  const { data } = location?.state ? location?.state : { data: null };
  console.log(data)
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails.token);
  const [activeOption, setActiveOption] = useState(navOptions[0]);

  const [contractItems, setContractItems] = useState([]);
  const [marketList, setMarketList] = useState([]);

  const getMarketList = async () => {
    const type=data.type;
    try {
      const { data } = await client.get("/domesticStaff/get-staff");

      if (data.domesticStaff) {
        setMarketList(!type ? data.domesticStaff : data.domesticStaff?.filter(
          (current) => current.staff_category === type
        ) .filter((current) => Number(current.availability_status) === 1));
      } else {
        setMarketList([]);
      }
    } catch (error) {
      onFailure({
        message: "soemthing went wrong",
        error: "Error retriving carted items",
      });
    }
  };

  const getContractItems = async () => {
    const type=data.type;
    try {
      const { data } = await client.post("/contracts/details", {
        user_id: authDetails.user.id,
        user_type: authDetails.user.role,
      });

      if (data.contracts) {
        setContractItems(!type ? data.contracts : data.contracts?.filter(
          (current) => current.staff_category === type
        ));
      } else {
        setContractItems([]);
      }
    } catch (error) {
      onFailure({
        message: "soemthing went wrong",
        error: "Error retriving carted items",
      });
    }
  };

  useEffect(() => {
    getContractItems();
    getMarketList();
  }, []);

  return (
    <div className="w-full space-y-8 pb-5">
      <nav className="flex bg-gray-50 gap-5 px-2 my-2">
        {navOptions.map((current) => (
          <a
            href="#"
            key={current}
            onClick={() => setActiveOption(current)}
            className={`flex items-center gap-2 py-2 ${
              activeOption === current
                ? "font-semibold border-b-2 border-green-500"
                : ""
            }`}
          >
            <span>{current}</span> <span className="flex items-center justify-center px-2 rounded-full bg-gray-700 text-white">{current === navOptions[0] ? contractItems?.length : marketList?.length}</span>
          </a>
        ))}
      </nav>

      {activeOption === navOptions[0] && (
        <>
        <strong className="text-xl text-gray-700 font-medium pt-4">Your contracts</strong>
        <TableHead>
          {contractItems.length > 0 &&
            contractItems
              .filter((current) => current.middle_name)
              .reverse()
              .map((current, index) => <TableRow key={current.id + index} data={current} />)}
        </TableHead>

        </>
        
      )}
      {activeOption === navOptions[1] && (
        <>
        <strong className="text-xl text-gray-700 font-medium pt-4">Only available staff are shown here</strong>
        <TableHead isMarket={true} >
          {marketList.length > 0 &&
            marketList
             .map((current, index) => (
                <TableRow isMarket={true} key={current.id + index} data={current} handleAddToCart={handleAddToCart} />
              ))}
        </TableHead>
        </>
      )}
    </div>
  );
}

export default MarketPlace;
