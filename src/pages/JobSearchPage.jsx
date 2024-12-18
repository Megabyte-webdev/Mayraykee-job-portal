import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/base";
import Hero from "../components/Landing/Hero";
import Navbar from "../components/Landing/Navbar";
import Advert from "../components/Landing/Advert";
import Footer from "../components/Landing/Footer";
import useJobManagement from "../hooks/useJobManagement";


const jobSectors = [
  {
    id: 1,
    name: "Agriculture",
    subsections: [
      { id: 1.1, name: "Crop Production" },
      { id: 1.2, name: "Animal Husbandry" },
      { id: 1.3, name: "Agricultural Technology" },
    ],
  },
  {
    id: 2,
    name: "Oil and gas",
    subsections: [
      { id: 2.1, name: "Exploration" },
      { id: 2.2, name: "Extraction" },
      { id: 2.3, name: "Refining" },
    ],
  },
  {
    id: 3,
    name: "Manufacturing",
    subsections: [
      { id: 3.1, name: "Textiles" },
      { id: 3.2, name: "Electronics" },
      { id: 3.3, name: "Automobiles" },
    ],
  },
  {
    id: 4,
    name: "Information and communications",
    subsections: [
      { id: 4.1, name: "Software Development" },
      { id: 4.2, name: "Network Administration" },
      { id: 4.3, name: "Cybersecurity" },
    ],
  },
  {
    id: 5,
    name: "Information Technology",
    subsections: [
      { id: 5.1, name: "Cloud Computing" },
      { id: 5.2, name: "Data Science" },
      { id: 5.3, name: "IT Support" },
    ],
  },
  {
    id: 6,
    name: "Construction",
    subsections: [
      { id: 6.1, name: "Residential" },
      { id: 6.2, name: "Commercial" },
      { id: 6.3, name: "Infrastructure" },
    ],
  },
  {
    id: 7,
    name: "Services",
    subsections: [
      { id: 7.1, name: "Hospitality" },
      { id: 7.2, name: "Consulting" },
      { id: 7.3, name: "Customer Support" },
    ],
  },
  {
    id: 8,
    name: "HealthCare",
    subsections: [
      { id: 8.1, name: "Clinical Services" },
      { id: 8.2, name: "Research" },
      { id: 8.3, name: "Public Health" },
    ],
  },
];

const JobSearchPage = () => {
  const { getEmployentTypes, getCurrencies } = useJobManagement();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    sector: "",
    type: "",
    currency:"",
    // minSalary: "",
    // maxSalary: "",
    // experience: "",
    // datePosted: "",
    // sortBy: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [employementList, setEmployementList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  
  const jobsPerPage = 5;

  useEffect(() => {
    const initData = async () => {
      const employementListResult = await getEmployentTypes();
      const currencyResult = await getCurrencies();
      console.log(employementListResult,currencyResult)
      setEmployementList(employementListResult);
      setCurrencyList(currencyResult)
    };

    initData();
    
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value) // Remove empty filters
        )
      ).toString();

      const response = await axios.get(`${BASE_URL}/jobs/search?${params}`);
      const fetchedJobs = response?.data?.data || [];
      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    setCurrentPage(1); // Reset to first page on filter change
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      keyword: "",
      sector: "",
      type: "",
      //minSalary: "",
      currency:"",
      //maxSalary: "",
      // experience: "",
      // datePosted: "",
      // sortBy: "",
    });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(jobs.length / jobsPerPage);
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const currentJobs = jobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );


  return (
    <>
      <div className="relative max-w-[1400px] w-full mx-auto">
        <Navbar />
        <main className="relative my-20 px-5 h-full">
          <Hero shrink={true} title="Discover thousands of job opportunities across various sectors, tailored to match your skills and aspirations." />
          <div className="job-search-page max-w-7xl mx-auto my-4 px-4 h-max">
            <h1 className="text-center text-3xl font-bold my-8">
            Find Your Dream Job Today
            </h1>

            {/* Filters and Listings */}
            <div className="flex flex-col md:flex-row md:items-start gap-8 py-8">
              {/* Filter Panel */}
              <div className="filter-panel bg-white p-6 md:sticky md:top-20 shadow-md rounded-md border min-w-72 h-max overflow-y-auto">
                <h2 className="text-xl font-bold mb-6">Filters</h2>
                {Object.keys(filters).map((filterKey) => (
                  <div className="mb-4" key={filterKey}>
                    <label className="block mb-1 text-sm font-medium capitalize">
                      {filterKey.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    {filterKey === "sector" ||
                    filterKey === "type" ||
                    filterKey === "currency"
                     ? (
                      <select
                        className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) =>
                          handleFilterChange(filterKey, e.target.value)
                        }
                        value={filters[filterKey]}
                      >
                        <option value="">All</option>
                        {/* Add specific options for each dropdown */}
                        {filterKey === "sector" && (
                          <>
                         { jobSectors?.map((item)=>(
                            <option key={item.id} value={item?.name} > {item?.name} </option>
                            
                          ))}
                            
                          </>
                        )}
                                                
                        {filterKey === "type" && (
                          <>
                         { employementList?.map((item)=>(
                            <option key={item.id} value={item?.name} > {item?.name} </option>
                            
                          ))}
                            
                          </>
                        )}
                        {filterKey === "currency" && (
                          <>
                         { currencyList?.map((item)=>(
                            <option key={item.id} value={item?.name} > {item?.name} </option>
                            
                          ))}                           
                          </>
                        )}
                        {/* {filterKey === "experience" && (
                          <>
                            <option value="Entry-level">Entry-level</option>
                            <option value="Mid-level">Mid-level</option>
                            <option value="Senior-level">Senior-level</option>
                          </>
                        )} */}
                        {/* {filterKey === "datePosted" && (
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
                        )} */}
                      </select>
                    ) : (
                      <input
                        type={filterKey.includes("Salary") ? "number" : "text"}
                        className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                        placeholder={`Enter ${filterKey}`}
                        onChange={(e) =>
                          handleFilterChange(filterKey, e.target.value)
                        }
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
              <div className="md:w-2/3 min-h-80 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center mt-10 min-h-60">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
                  </div>
                ) : (
                  <>
                    {currentJobs.length > 0 ? (
                      <div className="space-y-6 grid grid-cols-responsive gap-3">
                        {currentJobs.map((job) => (
                          <div
                            key={job.id}
                            className="flex flex-col bg-white p-6 shadow-md rounded-md border"
                          >
                            <h3 className="text-lg font-bold text-green-800">
                              {job.job_title}
                            </h3>
                            <p className="text-gray-600 text-sm font-medium">
                              {job.location}
                            </p>
                            <p>
                              <strong>Type:</strong> {job.type}
                            </p>
                            <p>
                              <strong>Salary:</strong> {job.currency}{" "}
                              {job.min_salary} - {job.max_salary} /{" "}
                              {job.salary_type}
                            </p>
                            <p className="flex gap-x-2">
                              <strong>Experience:</strong>{" "}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: job.experience,
                                }}
                              ></span>
                            </p>
                            <p className="mb-2">
                              <strong>Application Deadline:</strong>{" "}
                              {job.application_deadline_date}
                            </p>
                            <a
                              href={job?.external_url || "javascript:void(0)"}
                              target={job?.external_url && "_blank"}
                              rel="noopener noreferrer"
                              className="text-center text-sm mt-auto bg-green-600 p-2 rounded-md text-white font-medium mb-2 inline-block"
                            >
                              More Information
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        No jobs found.
                      </p>
                    )}
                  </>
                )}

                {/* Pagination */}
                <div className="pagination flex justify-between items-center mt-8">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of{" "}
                    {Math.ceil(jobs.length / jobsPerPage)}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={
                      currentPage === Math.ceil(jobs.length / jobsPerPage)
                    }
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Advert />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default JobSearchPage;
