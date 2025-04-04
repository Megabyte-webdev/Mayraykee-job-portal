import { useState } from "react";
import DefaultSwitch from "../../../components/DefaultSwitch";
import { useEffect } from "react";
import { AuthContext } from "../../../context/AuthContex";
import { useContext } from "react";
import useStaffUser from "../../../hooks/useStaffUser";

function VerificationItem({ currentKey, profileDetails, updateTrackRecord }) {
  const { updateAvailabilityStatus, getStyling, allStatus } = useStaffUser();
  const avaliabliltyDetail = profileDetails[currentKey];
  const { authDetails } = useContext(AuthContext);
 
  const detail =
    allStatus.find((current) => current === profileDetails[currentKey]) ||
    "Not Recorded";

  
  const [enabled, setEnabled] = useState(detail === "1" ? true : false);

  const labelText = currentKey.replace(/_/g, " ").toLowerCase();

  const [loading, setloading] = useState(false);


  const toogleIsOpen = () => {
    updateTrackRecord(currentKey, !enabled);
    setEnabled(!enabled);
  };

  useEffect(() => {
    if (labelText === "availability status") {
      if (avaliabliltyDetail === "1") {
        setEnabled(true);
      } else {
        setEnabled(false);
      }
    }
  }, []);

  return (
    <>
      {labelText === "availability status" ? (
        <div key={currentKey} className="flex gap-1 w-[50%] justify-between">
          <label className="capitalize">{labelText}</label>
          <DefaultSwitch
            enabled={enabled}
            disabled={loading}
            loading={loading}
            onClick={async () => {
              setloading(true);
              const result = await updateAvailabilityStatus(
                authDetails.user.id,
                enabled ? "0" : "1"
              );
              if (result) {
                setEnabled(!enabled);
              }
              setloading(false);
            }}
          />
        </div>
      ) : (
        <div key={currentKey} className="flex gap-1 w-full max-w-[600px] justify-between">
          <label className="capitalize">{labelText}:</label>
          <span
            className={`${getStyling(
              detail
            )} text-black capitalize font-semibold"`}
          >
            {detail}
          </span>
        </div>
      )}
    </>
  );
}

export default VerificationItem;
