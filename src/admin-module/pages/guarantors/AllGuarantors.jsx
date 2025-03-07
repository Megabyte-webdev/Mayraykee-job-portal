import { useState, useEffect } from "react";
import useAdminManagement from "../../../hooks/useAdminManagement";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import { Button } from "primereact/button";
import { FaArrowLeftLong } from "react-icons/fa6";

function AllGuarantors() {
  const { getStaffReport, loading } = useAdminManagement();
  const [guarantors, setGuarantors] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getStaffReport("guarantor");
      console.log("Fetched Data:", data); // Log the fetched data
      const sortedData = data.guarantors.sort((a, b) => b.id - a.id);
      if (data) {
        setGuarantors(sortedData);
      } else {
        console.error("No data received");
      }
    })();
  }, []);

  const heading = ["ID", "Name","Email", "Occupation","Created At", "Residential Address", "DOB", "Status","StaffID"];
  
  const data = guarantors.map(guarantor => ({
    [heading[0].toLowerCase()]: guarantor.domestic_staff_id,
    [heading[1].toLowerCase()]: guarantor.title + " " + guarantor.surname +  " " + guarantor.first_name,
    [heading[2].toLowerCase()]: guarantor.email,
    [heading[3].toLowerCase()]: guarantor.occupation,
    [heading[4].toLowerCase()]: new Date(guarantor.created_at).toLocaleDateString('en-GB', {day: '2-digit', month:'2-digit', year:'numeric'}),
    [heading[5].toLowerCase()]: guarantor.residential_address,
    [heading[6].toLowerCase()]: new Date(guarantor.dob).toLocaleDateString('en-GB', {day: '2-digit', month:'2-digit', year:'numeric'})?.replaceAll("/", "-"),
    [heading[7].toLowerCase()]: guarantor.status === null ? "Pending" : guarantor.status, // Check if status is null
    [heading[8].toLowerCase()]: guarantor.domestic_staff_id,
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
      <h2 className="text-black border-b border-gray-500 text-2xl font-bold mt-10">Guarantors</h2>
      <DataTableComponent heading={heading} data={data} loading={loading} name="domestic-staff" allowEdit={false} />
    </div>
  );
}

export default AllGuarantors;