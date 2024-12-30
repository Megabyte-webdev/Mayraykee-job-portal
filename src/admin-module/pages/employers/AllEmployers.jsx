import { useState, useEffect } from "react";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import { FaArrowLeftLong } from "react-icons/fa6";

function AllEmployers() {
  const { loading, getEmployers } = UseAdminManagement();
  const [employers, setEmployers] = useState([]);

 
  useEffect(() => {
    (async () => {
      const data = await getEmployers();
      console.log(data);  
      if (data) {
        const employersArray = Object.values(data);  
        const sortedData = employersArray.sort((a, b) => b.id - a.id);
        setEmployers(sortedData);
      } else {
        console.error("No data received");
      }
    })();
  }, []);

  // Table Headings
  const heading = ["ID", "Name", "Profile", "Image", "Status"];

 
  const data = employers.map(item => {
    const employerDetails = item.employer || {};  
    
    return {
      id: employerDetails.id,                                     
      name: employerDetails.company_name,
      profile: employerDetails.company_profile,
      image: (
        <img 
          src={`https://dash.mayrahkeeafrica.com/${employerDetails.logo_image}`} 
          alt="Logo" 
          className="h-10 w-10 rounded-full" 
        />
      ),                                             
      status: item.status
    };
  });

  return (
    <div className="mx-14 mt-10">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
      >
        <FaArrowLeftLong className="me-4 text-green-500" />Back
      </button>
      <h2 className="text-black border-b border-gray-500 text-2xl font-bold mt-10">Employers</h2>
      <DataTableComponent heading={heading} data={data} loading={loading} name="employer" allowEdit={true} />
    </div>
  );
}

export default AllEmployers;