import { useEffect, useState } from "react";
import useStaff from "../../../hooks/useStaff";
import { resourceUrl } from "../../../services/axios-client";

function PoliceRecord({ staff }) {
  const [policeRecord, setPoliceRecord] = useState(null);
  const { getPoliceDetails } = useStaff();

  useEffect(() => {
    const initData = async () => {
      const result = await getPoliceDetails(staff.id);
      if (result[0]) {
        setPoliceRecord({ ...result[0] });
      }
    };

    initData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-md">
        <h1 className="font-semibold">Status:</h1>
        {staff.police_report_verification_status ? (
          <span className="text-green-500">Verified</span>
        ) : (
          <span className="text-red-400">Unverified</span>
        )}
      </div>
      {policeRecord && (
        <div>
          <div className="text-black divide-x *:pl-2 grid grid-cols-responsive2 gap-x-2 gap-y-3 border-t mt-2 pt-3">
            <div className="flex flex-col text-lg  font-semibold text-gray-800">
              <h1>State</h1>
              <p className="text-md font-normal">{policeRecord.state}</p>
            </div>

            <div className="flex flex-col text-lg  font-semibold text-gray-800">
              <h1>LGA</h1>
              <p className="text-md font-normal">{policeRecord.lga}</p>
            </div>

            <div className="flex flex-col text-lg  font-semibold text-gray-800">
              <h1>Station Address</h1>
              <p className="text-md font-normal">
                {policeRecord.station_address}
              </p>
            </div>

            <div className="flex flex-col text-lg  font-semibold text-gray-800">
              <h1>Police Report File</h1>
              <a
                href={`${resourceUrl}/${policeRecord.police_report_file}`}
                className="text-md hover:underline text-blue-400 cursor-pointer font-normal"
              >
                View Police report
              </a>
            </div>
          </div>
        </div>
      )}

      {!policeRecord && (
        <div className="mt-10 w-fu">
          <span>No Police Record Availalble</span>
        </div>
      )}
    </div>
  );
}

export default PoliceRecord;
