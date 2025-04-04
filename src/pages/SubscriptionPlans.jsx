import { useContext } from "react";
import SubscriptionCard from "../components/subscription/SubscriptionCard";
import { SubscriptionContext } from "../context/SubscriptionContext";

function SubscriptionPlans({ packages, setIsOpen }) {
  const subUtils = useContext(SubscriptionContext);
  const backUpPackages = packages;

  return (
    <div className="h-full w-full flex flex-col items-center gap-5 overflow-y-auto bg-white">
      {subUtils?.loading ? (
        // Full-screen loader
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-primaryColor rounded-full animate-spin"></div>
            <p className="mt-4 text-green-300 text-lg font-semibold">Checking subscription, and loading packages...</p>
          </div>
        </div>
      ) : (
        <>
          <h2 className="font-semibold text-black text-3xl">Choose a plan</h2>

          <p className="w-[40%] p-2 text-center font-semibold text-white bg-[#504a4a]">
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
        </>
      )}
    </div>
  );
}

export default SubscriptionPlans;
