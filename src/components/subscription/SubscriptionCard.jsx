import { useContext, useState } from "react";
import { FormatPrice } from "../../utils/formmaters";
import Spinner from "../Spinner";
import { PaystackConsumer } from "react-paystack";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { SubscriptionContext } from "../../context/SubscriptionContext";
import { IoGift } from "react-icons/io5";
import { } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
function SubscriptionCard({ data, setIsOpen, currentPackage }) {
  const [showPerks, setShowPerks] = useState(currentPackage?.package_id === data?.id);
  const subUtils = useContext(SubscriptionContext);
  const navigate=useNavigate();
  const handleOnClick = (reference, data) => {
    subUtils.makePaymentCheck(reference, data);
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <li
      className={`${
        currentPackage?.package_id === data.id
          ? "opacity-70 pointer-events-none relative"
          : ""
      } duration-75 cursor-pointer rounded-[10px] group flex flex-col items-center justify-between p-3 border even:border even:bg-primaryColor even:text-white odd:text-primaryColor odd:border-primaryColor`}
    >
    {
      currentPackage?.package_id === data.id &&
      <IoGift size="50" className="absolute top-[-10px] left-0 right-0 mx-auto animate-bounce z-10" />
    }
      <div className="flex flex-col items-center h-96 overflow-y-auto">
        {/* Title */}
        <h3 className="sticky top-0 font-semibold group-odd:bg-white group-odd:border-primaryColor text-center group-even:bg-primaryColor group-even:border-white w-[60%] rounded-[5px] py-1 border text-md">
          {data.title}
        </h3>

        {/* Price */}
        <span className="font-semibold mt-[10%] text-xl flex gap-2 items-center">
          {data?.title?.toLowerCase().includes("exclusive") ? "Contract" : FormatPrice(Number(data.price))}
          <button
            onClick={() => setShowPerks(!showPerks)}
            className="text-sm border odd:border-primaryColor rounded-md px-2 py-1 transition-all hover:bg-primaryColor hover:text-white"
          >
            {showPerks ? "Desc" : "Perks"}
          </button>
        </span>
        {/*<span className="mt-5 text-little">user/month</span>*/}
          <article className="font-medium flex flex-col items-center my-2">
          <p>No. of Jobs: {data?.number_of_jobs || 0}</p>
          <p>Duration: {data?.duration} day(s)</p>
          </article> 
        {/* Description or Perks */}
        {!showPerks ? (
           <p className="my-5 text-little text-center w-[90%]">
            {data.description}
          </p>
        ) : (
          <div className="flex flex-col gap-2 p-2 text-[12px] items-start">
            {data?.permissions?.map((current, index) => (
              <div key={index} className="flex gap-2 font-bold text-sm w-full">
                <IoMdCheckmarkCircleOutline
                  size="18"
                  className="flex-shrink-0 text-green-500"
                />
                <span>{current}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Choose Plan Button */}
      {data?.title?.toLowerCase().includes("exclusive") ?
        
        <button
        onClick={()=>navigate("/company/help-center")}
            className={`text-sm font-semibold w-[80%] h-[35px] rounded-md transition-all ${
              currentPackage?.package_id === data.id
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "group-odd:bg-primaryColor group-odd:text-white group-even:bg-white group-even:text-primaryColor hover:scale-105"
            }`}
            disabled={currentPackage?.package_id === data.id}
          >
            Contact Mayrahkee Support
            </button>
  
      :<PaystackConsumer {...subUtils.config(data, handleOnClick)}>
        {({ initializePayment }) => (
          <button
            onClick={initializePayment}
            className={`text-sm font-semibold w-[80%] h-[35px] rounded-md transition-all ${
              currentPackage?.package_id === data.id
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "group-odd:bg-primaryColor group-odd:text-white group-even:bg-white group-even:text-primaryColor hover:scale-105"
            }`}
            disabled={currentPackage?.package_id === data.id}
          >
            Choose Plan
            {subUtils.loading && <Spinner />}
          </button>
        )}
      </PaystackConsumer>
      }
    </li>
  );
}

export default SubscriptionCard;
