import JobItem from "./JobItem";

function JobUpdates({jobs, applicants}) {
  return (
    <div className="w-full min-`h-[250px] border flex flex-col items-start">
      <div className="h-[50px] text-sm w-full font-semibold p-2 flex items-center border-b">
        <h3>Jobs Updates</h3>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-3 px-8 mt-4 h-[85%] justify-start items-start gap-[15px] w-full max-w-[98%] ">
        {jobs.map(current => <JobItem data={current} applicants={applicants}/>)}
      </ul>
    </div>
  );
}

export default JobUpdates;
