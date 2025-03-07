import { useEffect, useState } from "react";
import useStaff from "../../../hooks/useStaff";
import { resourceUrl } from "../../../services/axios-client";

function MedicalHistory({ staff }) {
  const [medicalHistory, setMedicalHistory] = useState(null);
  const { getMedicalDetails } = useStaff();

  useEffect(() => {
    const initData = async () => {
      const result = await getMedicalDetails(staff.id);
      if (result[0]) {
        setMedicalHistory({...result[0]});
      }
    };

    initData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-md">
        <h1 className="font-semibold">Status:</h1>
        {staff.medical_history_verification_status ? (
          <span className="text-green-500">Verified</span>
        ) : (
          <span className="text-red-400">Unverified</span>
        )}
      </div>
      {medicalHistory && (
        <div className="text-black divide-x *:pl-2 grid grid-cols-responsive2 gap-x-2 gap-y-3 border-t mt-2 pt-3">
          <div className="flex flex-col text-lg  font-semibold text-gray-800">
            <h1>Hospital Name</h1>
            <p className="text-md font-normal">
              {medicalHistory.hospital_name}
            </p>
          </div>

          <div className="flex flex-col text-lg  font-semibold text-gray-800">
            <h1>Contact Detail</h1>
            <p className="text-md font-normal">
              {medicalHistory.contact_detail}
            </p>
          </div>

          <div className="flex flex-col text-lg  font-semibold text-gray-800">
            <h1>Medical Reports</h1>
            <a
              href={`${resourceUrl}/${medicalHistory.medical_report_docs}`}
              className="text-md hover:underline text-blue-400 cursor-pointer font-normal"
            >
              View Medical report
            </a>
          </div>

        </div>
      )}

      {!medicalHistory && (
        <div className="mt-10 w-fu">
          <span>No Medical History</span>
        </div>
      )}
    </div>
  );
}

export default MedicalHistory;
