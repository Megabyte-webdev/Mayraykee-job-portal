import { useContext } from "react";
import SubscriptionPlans from "../pages/SubscriptionPlans";
import {FaSpinner} from "react-icons/fa";
import { SubscriptionContext } from "../context/SubscriptionContext";
import { AuthContext } from "../context/AuthContex";

function withSubscription(Component, title) {
  const subUtils = useContext(SubscriptionContext);
  const { authDetails } = useContext(AuthContext);
  
const activePackage = subUtils?.activePackage;
const currentPackage = activePackage
  ? subUtils?.packages?.find((pkg) => pkg.id === activePackage.package_id)
  : {};
  const hasPermission =
  authDetails?.user?.user_type === "exclusive" || // Always true for "exclusive" user type
  (title?.toLowerCase() === "job" && // For "job", check number_of_jobs > 0
    currentPackage?.number_of_jobs > 0) ||
  (title?.toLowerCase() === "candidate" && // For "candidate", check number_of_candidates > 0
    currentPackage?.number_of_candidates > 0) ||
  (title?.toLowerCase() === "message" && // For "message", allow only Premium or Plus packages
    ["Mayrahkee Premium", "Mayrahkee Plus"].includes(currentPackage?.title));



  return hasPermission ? (
    <Component />
  ) : (
    <div className="h-full flex pt-10 justify-center bg-gray-50">
      {!subUtils?.loading && subUtils?.activePackage ? (
        <div className="h-max w-full bg-white rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-4 text-green-700">
           Subscription Upgrade
          </h3>
          <p className="text-gray-600 font-bold mb-6">
            You do not have the required permissions to access this feature. Please upgrade your subscription to be able to access this package.
          </p>
        </div>
      ) : !subUtils?.loading && !subUtils?.activePackage ? (
        <div className="h-max w-full bg-white rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-4 text-green-700">
            Subscription Required
          </h3>
          <p className="text-gray-600 font-bold mb-6">
            Please subscribe to a package to access this feature. Enjoy
            benefits and tailored features designed for you!
          </p>
          {/*<SubscriptionPlans subUtils={subUtils} />*/}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <FaSpinner size="24" className="animate-spin" />
          <span className="mt-4 text-xl md:text-lg font-medium text-gray-500 text-center">
            Checking subscription status, please wait...
          </span>
        </div>
      )}
    </div>
  );
}

export default withSubscription;
