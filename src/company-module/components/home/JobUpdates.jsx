import React, { useState } from "react";
import JobItem from "./JobItem";

function JobUpdates({ jobs, applicants }) {
  const [currency, setCurrency] = useState(""); // Selected currency type
  const [salaryInput, setSalaryInput] = useState(""); // User-entered salary value

  // Get a list of unique currencies from the jobs data
  const uniqueCurrencies = [...new Set(jobs.map((job) => job.currency))];

  // Filter jobs based on currency and salary range
  const filteredJobs = jobs.filter((job) => {
    const salary = parseFloat(salaryInput);
    const minSalary = parseFloat(job?.min_salary);
    const maxSalary = parseFloat(job?.max_salary);

    return (
      (!currency || job.currency === currency) && // Match selected currency
      (!salaryInput || (salary >= minSalary && salary <= maxSalary)) // Salary within range
    );
  });

  return (
    <div className="w-full min-h-[250px] border flex flex-col items-start">
      <div className="h-[50px] text-sm w-full font-semibold p-2 flex items-center border-b">
        <h3>Jobs Updates</h3>
      </div>

      {/* Filter Section */}
      <div className="p-3 flex flex-wrap gap-4 items-center">
        {/* Currency Filter */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Currency</option>
          {uniqueCurrencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>

        {/* Salary Input */}
        <input
          type="number"
          placeholder="Enter Salary"
          value={salaryInput}
          onChange={(e) => setSalaryInput(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Job Listings */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-3 px-8 mt-4 h-[85%] justify-start items-start gap-[15px] w-full max-w-[98%]">
        {filteredJobs?.map((current) => (
          <JobItem key={current.id} data={current} applicants={applicants} />
        ))}
      </ul>
    </div>
  );
}

export default JobUpdates;
