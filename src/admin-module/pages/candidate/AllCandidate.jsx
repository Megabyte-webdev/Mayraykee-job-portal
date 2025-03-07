import { useState, useEffect } from "react";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Button } from "primereact/button";

function AllCandidate() {
  const { getCandidates, loading } = UseAdminManagement();
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getCandidates();
      const sortedData = data.sort((a, b) => b.id - a.id);
      if (data) {
        setCandidates(sortedData);
        console.log(data);
      } else {
        console.error("No data received");
      }
    })();
  }, []); // Dependency array ensures this runs only when getEmployers changes

  const heading = ["ID", "Name","Registered", "Email",  "Status", "Gender" ];
  const data = candidates?.map(candidate => ({
    [heading[0].toLowerCase()]: candidate.id,
    [heading[1].toLowerCase()]: candidate.first_name + " " + (candidate?.middle_name || "") + " " + candidate.last_name,
    [heading[2].toLowerCase()]: new Date(candidate.created_at).toLocaleDateString('en-GB', {day: '2-digit', month:'2-digit', year:'numeric'}),
    [heading[3].toLowerCase()]: candidate.email,
    [heading[4].toLowerCase()]: candidate.status,
    [heading[5].toLowerCase()]: candidate.gender,
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
      <h2 className="text-black border-b border-gray-500 text-2xl font-bold mt-10">Candidates</h2>
      <DataTableComponent heading={heading} data={data} loading={loading} name="candidate" allowEdit={true} />
    </div>
  );
}

export default AllCandidate;