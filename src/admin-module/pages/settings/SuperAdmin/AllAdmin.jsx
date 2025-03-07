import { useState, useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import DataTableComponent from "../../../components/DataTable/DataTableComponent";
import UseAdminManagement from "../../../../hooks/useAdminManagement";

function AllAdmins() {
  const { loading, getAllAdmins } = UseAdminManagement();
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getAllAdmins();
      console.log(data);
      if (data) {
        // Sort admins in descending order based on their IDs
        const sortedData = data.sort((a, b) => b.id - a.id);
        setAdmins(sortedData);
      } else {
        console.error("No data received");
      }
    })();
  }, []);

  const heading = ["ID", "Name", "Email", "Role", "Status"];
  
  const data = admins.map(admin => ({
    [heading[0].toLowerCase()]: admin.id,
    [heading[1].toLowerCase()]: admin.name,
    [heading[2].toLowerCase()]: admin.email,
    [heading[3].toLowerCase()]: admin.role,
    [heading[4].toLowerCase()]: admin.status,
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
      <h2 className="text-black border-b border-gray-500 text-2xl font-bold mt-10">Admins</h2>
      <DataTableComponent heading={heading} data={data} loading={loading} name="admins" allowEdit={true} />
    </div>
  );
}

export default AllAdmins;