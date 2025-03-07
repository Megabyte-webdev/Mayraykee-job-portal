import { useState, useEffect } from "react";
import useAdminManagement from "../../../hooks/useAdminManagement";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import { Button } from "primereact/button";
import { FaArrowLeftLong } from "react-icons/fa6";

function AllPoliceReports() {
  const { getStaffReport, loading } = useAdminManagement();
  const [policereports, setPoliceReports] = useState([]);

  useEffect(() => {
    ( async () => {
      const data = await getStaffReport("police-report");
      console.log("Fetched Data:", data); // Log the fetched data
      const sortedData = data.PoliceReports.sort((a, b) => b.id - a.id);
      if (data) {
        setPoliceReports(sortedData);
      } else {
        console.error("No data received");
      }
    })();
  }, []);

  const heading = ["ID", "State","LGA", "Station Address", "Report File", "Status","StaffID"];
  
  const data = policereports.map(police => ({
    [heading[0].toLowerCase()]: police.domestic_staff_id,
    [heading[1].toLowerCase()]: police.state,
    [heading[2].toLowerCase()]: police.lga,
    [heading[3].toLowerCase()]: police.station_address,
    [heading[4].toLowerCase()]: police.report_file,
    [heading[5].toLowerCase()]: police.status === null ? "Pending" : police.status, // Check if status is null
    [heading[6].toLowerCase()]: police.domestic_staff_id,
  }));

  return (
    <div className="mt-10">
    <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
        >
       <FaArrowLeftLong className="me-4 text-green-500" />Back
        </button>
      <h2 className="text-black border-b border-gray-500 text-2xl font-bold mt-10">Police Reports</h2>
      <DataTableComponent heading={heading} data={data} loading={loading} name="domestic-staff" allowEdit={false}/>
    </div>
  );
}

export default AllPoliceReports;