import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/base";

const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    sector: "",
    type: "",
    minSalary: "",
    maxSalary: "",
    experience: "",
    datePosted: "",
    sortBy: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/job`);
      const allJobs = response?.data || [];
      setJobs(allJobs);
      setFilteredJobs(allJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs.filter((job) => {
      const matchesKeyword = job.job_title.toLowerCase().includes(filters.keyword.toLowerCase());
      const matchesLocation = filters.location
        ? job?.location?.toLowerCase().includes(filters.location.toLowerCase())
        : true;
      const matchesType = filters.type ? job?.type?.toLowerCase() === filters.type.toLowerCase() : true;
      const matchesSector = filters.sector ? job?.sector?.toLowerCase() === filters.sector.toLowerCase() : true;
      const matchesMinSalary = filters.minSalary ? job?.min_salary >= parseInt(filters.minSalary) : true;
      const matchesMaxSalary = filters.maxSalary ? job?.max_salary <= parseInt(filters.maxSalary) : true;
      const matchesExperience = filters.experience
        ? job?.experience.toLowerCase() === filters.experience.toLowerCase()
        : true;
      const matchesDatePosted = filters.datePosted
        ? new Date(job?.date_posted) >= new Date(new Date().setDate(new Date().getDate() - parseInt(filters.datePosted)))
        : true;
      return (
        matchesKeyword &&
        matchesLocation &&
        matchesType &&
        matchesSector &&
        matchesMinSalary &&
        matchesMaxSalary &&
        matchesExperience &&
        matchesDatePosted
      );
    });

    if (filters.sortBy) {
      filtered = filtered.sort((a, b) => {
        if (filters.sortBy === "salary") {
          return b.max_salary - a.max_salary;
        } else if (filters.sortBy === "title") {
          return a.job_title.localeCompare(b.job_title);
        } else if (filters.sortBy === "deadline") {
          return new Date(a.application_deadline_date) - new Date(b.application_deadline_date);
        }
        return 0;
      });
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [filters, jobs]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      sector: "",
      type: "",
      minSalary: "",
      maxSalary: "",
      experience: "",
      datePosted: "",
      sortBy: "",
    });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <div className="job-search-page max-w-7xl mx-auto px-4 h-[100vh]">
      <h1 className="text-center text-3xl font-bold my-8">Job Search</h1>

      {/* Filters and Listings */}
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        {/* Filter Panel */}
        <div className="filter-panel bg-white p-6 md:sticky md:top-5 shadow-md rounded-md border min-w-72 h-max">
          <h2 className="text-xl bold mb-6">Filters</h2>
          {Object.keys(filters).map((filterKey) => (
            <div className="mb-4" key={filterKey}>
              <label className="block mb-1 text-sm font-medium capitalize">
                {filterKey.replace(/([A-Z])/g, " $1").trim()}
              </label>
              { filterKey === "sector" || filterKey === "type" || filterKey === "experience" || filterKey === "datePosted" || filterKey === "sortBy" ? (
                <select
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                  value={filters[filterKey]}
                >
                  <option value="">All</option>
                  {/* Add specific options for each dropdown here */}
                  {filterKey === "sector" && (
                    <>
                      <option value="IT">IT</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                    </>
                  )}
                  {filterKey === "type" && (
                    <>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </>
                  )}
                  {filterKey === "experience" && (
                    <>
                      <option value="Entry-level">Entry-level</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior-level">Senior-level</option>
                    </>
                  )}
                  {filterKey === "datePosted" && (
                    <>
                      <option value="7">Last 7 days</option>
                      <option value="14">Last 14 days</option>
                      <option value="30">Last 30 days</option>
                    </>
                  )}
                  {filterKey === "sortBy" && (
                    <>
                      <option value="salary">Salary</option>
                      <option value="title">Title</option>
                      <option value="deadline">Deadline</option>
                    </>
                  )}
                </select>
              ) : (
                <input
                  type={filterKey.includes("Salary") ? "number" : "text"}
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Enter ${filterKey}`}
                  onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                  value={filters[filterKey]}
                />
              )}
            </div>
          ))}
          <button
            className="w-full bg-green-600 text-white py-2 rounded-md mt-4"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>

        {/* Job Listings */}
        <div className="md:w-2/3  overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center mt-10 min-h-60">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
      </div>
          ) : (
            <>
              {currentJobs.length > 0 ? (
                <div className="space-y-6">
                  {currentJobs.map((job) => (
                    <div key={job.id} className="bg-white p-6 shadow-md rounded-md border">
                      <h3 className="text-lg font-bold">{job.job_title}</h3>
                      <p>{job.location}</p>
                      <p>
                        <strong>Type:</strong> {job.type}
                      </p>
                      <p>
                        <strong>Salary:</strong> {job.currency} {job.min_salary} - {job.max_salary} / {job.salary_type}
                      </p>
                      <p>
                        <strong>Experience:</strong> {job.experience}
                      </p>
                      <p>
                        <strong>Application Deadline:</strong> {job.application_deadline_date}
                      </p>
                      <a
                        href={job.external_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline mt-4 inline-block"
                      >
                        Apply Now
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No jobs found.</p>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination flex justify-between items-center mt-8">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
