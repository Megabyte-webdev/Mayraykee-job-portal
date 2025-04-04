import { Helmet } from "react-helmet";
import { CiSearch } from "react-icons/ci";
import { GrLocation } from "react-icons/gr";
import ChecksCategory from "./components/ChecksCategory";
import { BsGrid, BsGridFill } from "react-icons/bs";
import newApplicant from "../../../assets/pngs/applicant-logo1.png";
import JobCard from "./components/JobCard";
import { TbLayoutList, TbLayoutListFilled } from "react-icons/tb";
import { useState, useContext, useEffect } from "react";
import JobGridCard from "./components/JobGridCard";
import { ResourceContext } from "../../../context/ResourceContext";
import { useMemo } from "react";
import CustomPagination from "../../../components/CustomPagination";
import { State } from "country-state-city";

const PageSize = 3;

function FindJob() {
  const {
    getAllJobs,
    setGetAllJobs,
    getAllApplications,
    setGetAllApplications,
  } = useContext(ResourceContext);
  const [isGrid, setIsGrid] = useState(false);

  const [salaryRange, setSalaryRange] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [category, setCategory] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    setGetAllJobs((prev) => ({
      ...prev,
      isDataNeeded: true,
    }));
  }, []);

  useEffect(() => {
    setGetAllApplications((prev) => ({
      ...prev,
      isDataNeeded: true,
    }));
  }, []);

  const filteredData = getAllJobs.data?.filter(item=>item.status==="approved")
    ?.filter((job) => {
      const salaryFigures = job.min_salary?.split(".")[0];
      const salaryInRange = salaryRange ? salaryFigures >= salaryRange : true;
      const matchesEmploymentType = employmentType
        ? job.type?.toLowerCase().includes(employmentType?.toLowerCase())
        : true;
      const matchesCategory = category
        ? job.sector?.toLowerCase().includes(category?.toLowerCase())
        : true;
      const matchesJobLevel = jobLevel
        ? job.career_level?.toLowerCase() === jobLevel?.toLowerCase()
        : true;

      const matchesJobTitle = jobTitle
        ? job.job_title?.toLowerCase().includes(jobTitle?.toLowerCase())
        : true;

      const matchesLocation = selectedLocation
        ? job.location?.toLowerCase().includes(selectedLocation?.toLowerCase())
        : true;

      return (
        salaryInRange &&
        matchesEmploymentType &&
        matchesCategory &&
        matchesJobLevel &&
        matchesJobTitle &&
        matchesLocation
      );
    })
    .reverse();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filteredData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData]);

  const runSearchQuery = () => {
    if (!jobTitle && !selectedLocation) return;
    if (jobTitle) {
      setJobTitle();
    }
  };

  useEffect(() => {
    setTotalPage(Math.ceil(filteredData?.length / PageSize));
  }, [filteredData]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Find Job </title>
      </Helmet>
      <div className="h-full text-[#25324b] text-sm w-full">
        <div className="px-3 py-5 border mb-2 flex flex-col md:flex-row">
          <div className="relative border-b py-1 px-4 md:px-6 mx-4 w-full md:w-[35%] mb-2 md:mb-0">
            <input
              type="text"
              placeholder="Search Job"
              onChange={(e) => setJobTitle(e.target.value)}
              value={jobTitle}
              className="pl-[10px] focus:outline-none w-full"
            />
            <span className="absolute text-primary top-0 left-0 pr-2 py-1">
              <CiSearch size={20} />
            </span>
          </div>
          <div className="relative border-b py-1 px-4 md:px-6 mx-4 w-full md:w-[35%] mb-2 md:mb-0">
            <select
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-[10px] focus:outline-none w-full"
            >
              <option value={''} id={'030'}>
                Select Location
                </option>
              {State.getStatesOfCountry("NG").map((current) => (
                <option key={current?.id} value={current.name} id={current.name}>
                  {current.name}
                </option>
              ))}
            </select>
            <span className="absolute text-primary top-0 left-0 pr-2 py-1">
              <GrLocation size={20} />
            </span>
          </div>
          <button className="bg-green-700 text-white py-2 px-6 hover:bg-green-900 font-medium">
            Search
          </button>
        </div>
        <div className="my-6">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-[25%] mb-4 md:mb-0">
              <div className="checks_container pr-5">
                <div className="mb-4">
                  <ChecksCategory
                    setSalaryRange={setSalaryRange}
                    setEmploymentType={setEmploymentType}
                    setCategory={setCategory}
                    setJobLevel={setJobLevel}
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-[75%]">
              <div>
                <h4 className="font-bold text-base">All Jobs</h4>
                <div className="flex justify-between mb-6">
                  <div>
                    <p>Showing {getAllJobs.data?.length} results</p>
                  </div>
                  <div className="flex">
                    <div className="border- px-2">
                      <button
                        onClick={() => setIsGrid(true)}
                        className="bg-gray-200 rounded p-1 mx-1"
                      >
                        {isGrid ? (
                          <BsGridFill className="prime_text" />
                        ) : (
                          <BsGrid />
                        )}
                      </button>
                      <button
                        onClick={() => setIsGrid(false)}
                        className="bg-gray-200 rounded p-1 mx-1"
                      >
                        {isGrid ? (
                          <TbLayoutList />
                        ) : (
                          <TbLayoutListFilled className="prime_text" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="min-h-full overflow-y-auto thin_scroll_bar">
                  {getAllJobs.data && (
                    <div>
                      {isGrid ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {currentTableData?.map((job) => (
                            <JobGridCard
                              key={job.id}
                              job={job}
                              newApplicant={newApplicant}
                            />
                          ))}
                        </div>
                      ) : (
                        <div>
                          {currentTableData?.map((job) => (
                            <JobCard
                              getAllApplications={getAllApplications?.data}
                              key={job.id}
                              job={job}
                              newApplicant={newApplicant}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {getAllJobs.data && (
                <div>
                  <div>
                    <p>
                      Showing {currentPage}/{totalPage} of{" "}
                      {filteredData?.length} entries
                    </p>
                  </div>
                  <div className="my-6 flex justify-center">
                    <div>
                      <CustomPagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={filteredData?.length}
                        pageSize={PageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindJob;
