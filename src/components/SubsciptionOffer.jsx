import { useContext, useState } from "react";
import { SubscriptionContext } from "../context/SubscriptionContext";
import { IoGift } from "react-icons/io5";
import SubscriptionModal from "./subscription/SubscriptionModal";
import useSubscription from "../hooks/useSubscription";
import { AuthContext } from "../context/AuthContex";
function SubscriptionOffer() {
  const { authDetails } = useContext(AuthContext);
  const { activePackage } = useContext(SubscriptionContext) ?? {};
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <SubscriptionModal isOpen={isOpen} setIsOpen={setIsOpen} />
      {(!activePackage && authDetails?.user?.user_type !== "exclusive") && (
        <div className="w-full  text-white py-2 flex items-center justify-between px-5 bg-lightblue/50">
          <div className="flex flex-col *:animate-pulse ">
            <h1 className="font-semibold flex gap-2 items-center">
              Subscription Offers
            </h1>
            <p className="flex justify-between ">
              Subscribe to our plans to gain access to more benefits and a
              tailored experience 
            </p>
          </div>
          <button onClick={() => setIsOpen(true)} className="flex gap-2 items-center h-fit border-white border py-1 px-2">
            Subscribe
            <IoGift className="animate-bounce" />
          </button>
        </div>
      )}
    </>
  );
}

export default SubscriptionOffer;
