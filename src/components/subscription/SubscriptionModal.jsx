import { useContext, useEffect, useState } from "react";
import SubscriptionPlans from "../../pages/SubscriptionPlans";
import useSubscription from "../../hooks/useSubscription";
import { MdClose } from "react-icons/md";
import { SubscriptionContext } from "../../context/SubscriptionContext";

function SubscriptionModal({isOpen, setIsOpen}) {
  // const [isOpen, setIsOpen] = useState(false);
  const subUtils = useContext(SubscriptionContext);


  return (
    isOpen && (
      <div className="h-full z-50 w-full text-gray-400 text-little flex justify-center items-center bg-gray-600/70 fixed top-0 bottom-0 right-0 left-0 m-auto">
        <div className="w-[90%] h-[95%] p-4 flex flex-col rounded-[10px]  bg-white border">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-red-500 text-white font-bold flex items-center place-self-end justify-center rounded-[5px] gap-[5px] w-fit border px-2 py-1"
          >
            Close
            <MdClose className=" mt-[2px] font-bold text-white" />
          </button>
          <SubscriptionPlans
            packages={subUtils.packages}
            setIsOpen={setIsOpen}
          />
        </div>{" "}
      </div>
    )
  );
}

export default SubscriptionModal;
