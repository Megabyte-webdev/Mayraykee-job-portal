import { useState, useEffect } from "react";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import { FaArrowLeftLong, FaSpinner } from "react-icons/fa6";

function AllDomesticStaff() {
  const { loading: apiLoading, getDomesticStaff } = UseAdminManagement(); // Retain API loading state
  const [domesticStaff, setDomesticStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Local loading state for component
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    (async () => {
      setIsLoading(true); // Set loading to true before fetching data
      setError(null); // Reset error state
      try {
        const data = await getDomesticStaff();
        if (data) {
          const sortedData = data.sort((a, b) => b.id - a.id);
          setDomesticStaff(sortedData);
        } else {
          throw new Error("No data received");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false); // Set loading to false after data fetch
      }
    })();
  }, []);

  const heading = [
    "ID",
    "Name",
    "Registered",
    "Email",
    "Subcategory",
    "Job",
    "Status",
    "YOE",
    "Current Salary",
    "Expected Salary",
    "Location",
  ];

  const data = domesticStaff.map((staff) => ({
    [heading[0].toLowerCase()]: staff.id,
    [heading[1].toLowerCase()]:
      staff.first_name +
      " " +
      (staff.middle_name === null || staff.middle_name === "null"
        ? ""
        : staff.middle_name) +
      " " +
      staff.surname,
    [heading[2].toLowerCase()]: new Date(staff.created_at).toLocaleDateString('en-GB', {day: '2-digit', month:'2-digit', year:'numeric'}),
    [heading[3].toLowerCase()]: staff.email,
    [heading[4].toLowerCase()]: staff.subcategory,
    [heading[5].toLowerCase()]: staff.job_type,
    [heading[6].toLowerCase()]: staff.status,
    [heading[7].toLowerCase()]: staff.years_of_experience,
    [heading[8].toLowerCase()]: staff.current_salary,
    [heading[9].toLowerCase()]: staff.expected_salary,
    [heading[10].toLowerCase()]: staff.location,
  }));

  return (
    <div className="mt-10">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
      >
        <FaArrowLeftLong className="me-4 text-green-500" />
        Back
      </button>
      <h2 className="text-black border-b border-gray-500 text-2xl font-bold mt-10">
        Domestic Staff
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <FaSpinner className="animate-spin text-green-500 text-2xl" />
          <span className="ml-2 text-lg font-semibold">Loading...</span>
        </div>
      ) : error ? ( // Conditional rendering for error state
        <div className="flex justify-center items-center h-32 text-red-500">
          <span className="text-lg font-semibold">{error}</span>
        </div>
      ) : (
        <DataTableComponent
          heading={heading}
          data={data}
          loading={isLoading} // Use API loading state for DataTableComponent
          name="domestic-staff"
          allowEdit={true}
        />
      )}
    </div>
  );
}

export default AllDomesticStaff;
