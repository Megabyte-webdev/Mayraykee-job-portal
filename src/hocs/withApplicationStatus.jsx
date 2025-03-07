import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContex";
import { FaSpinner } from "react-icons/fa";

function withApplicationStatus(Component) {
    const { authDetails } = useContext(AuthContext);
  const ValidComponent=()=>React.isValidElement(Component) ? Component : <Component />;
    const status = authDetails?.user?.status?.toLowerCase();

    if (!status) {
      return (
        <div className="h-max w-full flex flex-col items-center bg-white rounded-lg p-6 text-center">
          <h3 className="text-2xl max-w-[600px] font-bold mb-4 text-red-600">
            Application Status Unknown
          </h3>
          <p className="text-gray-600 max-w-[600px] font-bold mb-6">
            We could not determine your application status. Please contact support.
          </p>
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="h-max w-full flex flex-col items-center bg-white rounded-lg p-6 text-center">
          <h3 className="text-2xl max-w-[600px] font-bold mb-4 text-yellow-600">
            Application Pending
          </h3>
          <p className="text-gray-600 max-w-[600px] font-bold mb-6">
            Your application is pending approval. Please update your profile and check back later.
          </p>
        </div>
      );
    }

    if (status === "approved") {
      return <ValidComponent />;
    }

    if (status === "rejected") {
      return (
        <div className="h-max w-full flex flex-col items-center bg-white rounded-lg p-6 text-center">
          <h3 className="text-2xl max-w-[600px] font-bold mb-4 text-red-700">
            Application Rejected
          </h3>
          <p className="text-gray-600 max-w-[600px] font-bold mb-6">
            Your application has been rejected. Please contact support for more details.
          </p>
        </div>
      );
    }

    if (status === "suspended") {
      return (
        <div className="h-max w-full flex flex-col items-center bg-white rounded-lg p-6 text-center">
          <h3 className="text-2xl max-w-[600px] font-bold mb-4 text-orange-700">
            Account Suspended
          </h3>
          <p className="text-gray-600 max-w-[600px] font-bold mb-6">
            Your account has been suspended due to policy violations. Contact support for assistance.
          </p>
        </div>
      );
    }

    return (
      <div className="h-max w-full flex flex-col items-center bg-white rounded-lg p-6 text-center">
        <h3 className="text-2xl max-w-[600px] font-bold mb-4 text-gray-700">
          Unknown Status
        </h3>
        <p className="text-gray-600 max-w-[600px] font-bold mb-6">
          We couldn't process your application status. Please contact support.
        </p>
      </div>
    );

}

export default withApplicationStatus;
