import { useContext, useState } from "react";
import { FormatPrice } from "../../utils/formmaters";
import Spinner from "../Spinner";
import { PaystackConsumer } from "react-paystack";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { SubscriptionContext } from "../../context/SubscriptionContext";
import { IoGift } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function SubscriptionCard({ data, setIsOpen, currentPackage }) {
  const [showPerks, setShowPerks] = useState(currentPackage?.package_id === data?.id);
  const [quantity, setQuantity] = useState(1); // Track quantity input
  const subUtils = useContext(SubscriptionContext);
  const navigate = useNavigate();

  const handleOnClick = (reference, data) => {
    subUtils?.makePaymentCheck(reference, data);
    if (setIsOpen) {
      setIsOpen(false);
    }
  };
  const handlePayment = (initializePayment) => {
      initializePayment();
  };

  const handleQuantityChange = (e) => {
  const value = e.target.value;
  if (value === "") {
    setQuantity(""); // Allow empty input temporarily
  } else {
    setQuantity(Math.max(1, Number(value))); // Prevent zero/negative numbers
  }
};


  return (
    <li className="group relative duration-75 rounded-[10px] group flex flex-col items-center justify-between p-3 border even:border even:bg-primaryColor even:text-white odd:text-primaryColor odd:border-primaryColor">
      {currentPackage?.package_id === data.id && (
        <IoGift size="50" className="absolute top-[-10px] left-0 right-0 mx-auto animate-bounce z-10" />
      )}
      
      <div className="flex flex-col items-center h-96 overflow-y-auto">
        {/* Title */}
        <h3 className="sticky top-0 font-semibold group-odd:bg-white group-odd:border-primaryColor text-center group-even:bg-primaryColor group-even:border-white w-[60%] rounded-[5px] py-1 border text-md">
          {data.title}
        </h3>

        {/* Price */}
        <span className="font-semibold mt-[10%] text-xl flex gap-2 items-center">
          {data?.title?.toLowerCase().includes("exclusive") ? "Contract" : `₦ ${FormatPrice(Number(data.price) * quantity)}`}
          <button
            onClick={() => setShowPerks(!showPerks)}
            className="text-sm border odd:border-primaryColor rounded-md px-2 py-1 transition-all hover:bg-primaryColor hover:text-white"
          >
            {showPerks ? "Desc" : "Perks"}
          </button>
        </span>

        {/* Quantity Input */}
        {!data?.title?.toLowerCase().includes("exclusive") &&<div className="mt-3 text-center">
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="font-medium w-20 text-center border-2 group-even:border-white group-odd:border-primaryColor bg-transparent rounded-md py-1 px-2"
          />
        </div>}

        {/* Features */}
        <article className="font-medium flex flex-col items-center my-2">
          <p>Jobs per subscription: {data?.number_of_jobs || 0}</p>
          {currentPackage?.package_id === data.id && <p>Jobs Remaining: {currentPackage?.available_jobs}</p>}
          <p>Duration: {data?.duration} {data?.duration > 1 ? "days": "day"}</p>
        </article>

        {/* Description or Perks */}
        {!showPerks ? (
          <p className="my-5 text-little text-center w-[90%]">{data.description}</p>
        ) : (
          <div className="flex flex-col gap-2 p-2 text-[12px] items-start">
            {data?.permissions?.map((current, index) => (
              <div key={index} className="flex gap-2 font-bold text-sm w-full">
                <IoMdCheckmarkCircleOutline size="18" className="flex-shrink-0 text-green-500" />
                <span>{current}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Choose Plan Button */}
      {data?.title?.toLowerCase().includes("exclusive") ? (
        <button
          onClick={() => navigate("/company/help-center")}
          className="text-sm font-semibold w-[80%] h-[35px] rounded-md transition-all group-odd:bg-primaryColor group-odd:text-white group-even:bg-white group-even:text-primaryColor hover:scale-105"
          disabled={currentPackage?.package_id === data.id}
        >
          Contact Mayrahkee Support
        </button>
      ) : (
        <PaystackConsumer
          {...subUtils?.config(
            { ...data, price: Number(data.price) * quantity, quantity: quantity }, // Update price with quantity
            handleOnClick
          )}
        >
          {({ initializePayment }) => (
            <button
              disabled={subUtils?.loading}
              onClick={() => handlePayment(initializePayment)}
              className="text-sm font-semibold w-[80%] h-[35px] rounded-md transition-all group-odd:bg-primaryColor group-odd:text-white group-even:bg-white group-even:text-primaryColor hover:scale-105"
            >
              {subUtils?.loading ? "Processing..." : "Choose Plan"}
            </button>
          )}
        </PaystackConsumer>
      )}
      {subUtils?.loading && <Spinner />}
    </li>
  );
}

export default SubscriptionCard;
