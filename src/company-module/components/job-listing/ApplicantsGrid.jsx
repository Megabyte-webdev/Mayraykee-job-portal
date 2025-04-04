import GridRow from "./GridRow";

const stages = [
  {
    id: 1,
    name: 'in-review',
    label: 'under-review',
    border_color: 'border-orange-500',
  },
  {
    id: 3,
    name: 'pending',
    label: 'pending',
    border_color: 'border-[#5cbbff]',
  },
  {
    id: 1,
    name: 'shortlist',
    label: 'shortlisted',
    border_color: 'border-[#4640de]',
  },
  {
    id: 3,
    name: 'interview',
    label: 'interviewed',
    border_color: 'border-[#ffb836]',
  },
  {
    id: 2,
    name: 'hired',
    label: 'hired',
    border_color: 'border-green-500',
  },
  {
    id: 3,
    name: 'declined',
    label: 'declined',
    border_color: 'border-red-500',
  },
];

function ApplicantsGrid({ applicants, searchTerm, exclusive=false }) {
  // Filter applicants based on the search term
  const filteredApplicants = searchTerm
    ? applicants?.filter((applicant) =>
        applicant?.full_name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : applicants;

  // Filter stages based on the search term:
  // - When searchTerm is empty, show all stages.
  // - When there's a search term, only show stages with matching applicants.
  const filteredStages = searchTerm
    ? stages.map((stage) => {
        // Get applicants for the current stage
        const applicantsInStage = filteredApplicants.filter(
          (applicant) => applicant.status === stage.name
        );
        // Only return the stage if it has matching applicants
        return applicantsInStage.length > 0 ? { ...stage, applicantsInStage } : null;
      }).filter(Boolean) // Remove null stages
    : stages; // Show all stages when there's no search term

  return (
    <div className="min-w-full overflow-x-auto grid grid-cols-1 md:grid-cols-3 gap-[20px]">
      {/* Render stages in their original order */}
      {filteredStages.map((stage, idx) => (
        <GridRow key={idx} applicants={stage.applicantsInStage || applicants.filter(applicant => applicant.status === stage.name)} data={stage} exclusive={exclusive} />
      ))}
    </div>
  );
}

export default ApplicantsGrid;
