import { useEffect, useState } from "react";
import ApplicantsList from "./ApplicantsList";
import ApplicantsGrid from "./ApplicantsGrid";

function Applicants({ applicants, exclusive=false }) {
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [filteredApplicants, setFilteredApplicants] = useState(applicants);
 console.log(applicants)
  useEffect(() => {
    console.log(searchTerm)
    // Filter applicants based on the search term
    if (searchTerm !== "") {
      setFilteredApplicants(
        applicants.filter((applicant) =>
          applicant?.full_name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        )
      );
    } else {
      setFilteredApplicants(applicants); // Show all applicants when search is empty
    }
  }, [searchTerm, applicants]); // Dependencies should be searchTerm and applicants

  return (
    <div className="py-2 flex flex-col w-full gap-2">
      <div className="w-full flex flex-wrap justify-between items-center gap-2">
        <span className="text-center w-full sm:w-auto">
          Total Applicants: {filteredApplicants.length} {/* Show filtered count */}
        </span>

        <div className="flex flex-wrap justify-center items-center gap-2 w-full sm:w-auto">
          <input
            className="py-2 px-2 border text-sm"
            placeholder="Search Applicant"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
          />

          <div className="p-1 bg-primaryColor flex justify-between gap-2">
            <button
              onClick={() => setView("grid")}
              className={`h-full p-2 text-little ${
                view === "grid" ? "bg-primaryColor text-white" : "bg-white text-gray-700"
              }`}
            >
              Pipeview
            </button>
            <button
              onClick={() => setView("table")}
              className={`h-full p-2 text-little ${
                view === "table" ? "bg-primaryColor text-white" : "bg-white text-gray-700"
              }`}
            >
              Tableview
            </button>
          </div>
        </div>
      </div>

      {selectedApplicant ? (
        <div className="p-4 border rounded bg-gray-100">
          <h2 className="font-semibold">Applicant Details</h2>
          <p>Name: {selectedApplicant.name}</p>
          <p>Email: {selectedApplicant.email}</p>
          <button
            onClick={() => setSelectedApplicant(null)}
            className="mt-2 px-4 py-2 bg-primaryColor text-white rounded"
          >
            Back to List
          </button>
        </div>
      ) : view === "table" ? (
        <ApplicantsList applicants={filteredApplicants} onSelect={setSelectedApplicant} exclusive={exclusive} />
      ) : (
        <ApplicantsGrid applicants={filteredApplicants} searchTerm={searchTerm} exclusive={exclusive} />
      )}
    </div>
  );
}

export default Applicants;
