import { useContext } from "react";
import SubscriptionCard from "../components/subscription/SubscriptionCard";
import { SubscriptionContext } from "../context/SubscriptionContext";
//import useSubscription from "../hooks/useSubscription";

function SubscriptionPlans({ packages, setIsOpen }) {
   const subUtils = useContext(SubscriptionContext);
  const backUpPackages=packages 
  return (
    <div className="h-full w-full items-center gap-5 overflow-y-auto bg-white flex flex-col">
      <h2 className="font-semibold text-black text-3xl">Choose a plan</h2>

      <p className="w-[40%] p-2 text-center font-semibold text-white bg-primaryColor/50">
        Monthly Plan
      </p>
      <p className="max-w-60 p-2 text-center font-semibold text-primaryColor">
        Best Subscription plans for Mayrahkee
      </p>

      <ul className="grid grid-cols-responsive gap-y-7 md:gap-5 w-full">
        {backUpPackages?.map((current) => (
          <SubscriptionCard
            setIsOpen={setIsOpen}
            key={current.id}
            data={current}
            currentPackage={subUtils?.activePackage}
          />
        ))}
      </ul>
    </div>
  );
}

export default SubscriptionPlans;
