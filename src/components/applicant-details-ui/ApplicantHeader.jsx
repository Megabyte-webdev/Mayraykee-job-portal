import { useState } from "react";
import useStaff from "../../hooks/useStaff";
import { onFailure } from "../../utils/notifications/OnFailure";
import { PiSpinnerGap } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const ApplicantHeader = ({ staff, setStaff }) => {
  const { ContractStatus, updateContractStatus } = useStaff();
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const navigate = useNavigate();

  // Status checks based on 1 (Accepted) or 0 (Pending/Active)
  const isAccepted = Number(staff?.contract_status) === 1;
  const isRejected = Number(staff?.contract_status) === 2;

  const handleAccept = async () => {
    setAcceptLoading(true);
    const result = await updateContractStatus(staff, ContractStatus.accept, setStaff);
    setAcceptLoading(false);
    if (!result) {
      onFailure({ message: "Update Error", error: "Could not accept" });
    }
  };

  const handleReject = async () => {
    setRejectLoading(true);
    const result = await updateContractStatus(staff, ContractStatus.reject, setStaff);
    setRejectLoading(false);
    if (result) {
      navigate("/company/staff/cart");
    } else {
      onFailure({ message: "Update Error", error: "Could not reject" });
    }
  };

  return (
    <header className="text-white p-4 flex flex-wrap gap-5 items-center justify-between">
      <section>
        <h2 className="text-xl font-bold text-blue-900">{staff?.first_name}</h2>
        <nav className="flex flex-wrap my-2 gap-2 font-medium">
          <a href="#" className="text-green-500">Offers</a>
          <a href="#" className="text-gray-800 capitalize">{staff?.staff_category?.toLowerCase() === "staff" ? "Domestic Staff" : "Artisan"}</a>
        </nav>
      </section>

      { (
        <div className="flex space-x-4">
          {/* Accept Button */}
          <button
            onClick={handleAccept}
            disabled={isAccepted}
            aria-busy={acceptLoading}
            className={`bg-green-600 relative text-white px-4 py-1 rounded overflow-hidden ${
              isAccepted ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isAccepted && !isRejected ? "Accepted" :"Accept"}
            {acceptLoading && (
              <div className="absolute left-0 top-0 z-[999] bg-gray-50/50 w-full h-full flex items-center justify-center">
                <PiSpinnerGap className="text-lg animate-spin text-black" />
              </div>
            )}
          </button>

          {/* Reject Button */}
          <button
            onClick={handleReject}
            disabled={isRejected}
            aria-busy={rejectLoading}
            className={`bg-red-600 relative text-white px-4 py-1 rounded ${
              isRejected ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
             {isRejected ? "Rejected" :"Reject"}
            {rejectLoading && (
              <div className="absolute left-0 top-0 z-[999] bg-gray-50/50 w-full h-full flex items-center justify-center">
                <PiSpinnerGap className="text-lg animate-spin text-black" />
              </div>
            )}
          </button>
        </div>
      )}

      
    </header>
  );
};

export default ApplicantHeader;
