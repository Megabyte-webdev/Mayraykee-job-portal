import { Helmet } from "react-helmet";
import { CiGrid2H, CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { MdArrowDropUp } from "react-icons/md";
import CompaniesCategory from "./components/CompaniesCategory";
import { BsGrid, BsGrid1X2Fill, BsGridFill } from "react-icons/bs";
import newApplicant from "../../../assets/pngs/applicant-logo1.png";
import newApplicant2 from "../../../assets/pngs/applicant-Logo2.png";
import newApplicant3 from "../../../assets/pngs/applicant-logo3.png";
import Pagination from "../../components/Pagination";
import { TbLayoutList, TbLayoutListFilled } from "react-icons/tb";
import { useContext, useEffect, useState } from "react";
import CompanyGridCard from "./components/CompanyGridCard";
import CompanyCard from "./components/CompanyCard";
import { ResourceContext } from "../../../context/ResourceContext";
import { useMemo } from "react";
import CustomPagination from "../../../components/CustomPagination";
import { State } from "country-state-city";

const PageSize = 3;

function Companies() {
  const [isGrid, setIsGrid] = useState(true);
  const [industry, setIndustry] = useState("");
  const [companies, setcompanies] = useState([]);
  const [companySize, setCompanySize] = useState("");
  const [companyName, setcompanyName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const { getAllJobs, setGetAllJobs, getAllCompanies, setGetAllCompanies } =
    useContext(ResourceContext);

  useEffect(() => {
    setGetAllCompanies((prev) => {
      return {
        ...prev,
        isDataNeeded: true,
      };
    });
  }, []);
  useEffect(() => {
    if(getAllCompanies.data){
      setcompanies(getAllCompanies.data?.filter(one=>one.employer !==null))
    }
    
  }, [getAllCompanies]);
  

  const filteredData = companies.filter(({ employer }) => {
    // Function to check if employer.company_size falls within the selected companySize range
    const filterSize = (companySize && employer?.company_size)
      ? (
          (companySize === "1-49" && employer.company_size >= 1 && employer.company_size <= 49) ||
          (companySize === "50-249" && employer.company_size >= 50 && employer.company_size <= 249) ||
          (companySize === "250+" && employer.company_size >= 250)
        )
      : true;
  
    const filterIndustry = industry
      ? employer?.sector?.toLowerCase().includes(industry?.toLowerCase())
      : true;
  
    const filterName = companyName
      ? employer?.company_name?.toLowerCase().includes(companyName?.toLowerCase())
      : true;
  
    const filterLocation = selectedLocation
      ? employer?.location?.toLowerCase()?.includes(selectedLocation?.toLowerCase())
      : true;
  
    return filterIndustry && filterSize && filterName && filterLocation;
  });
  

  // console.log(companies?.filter(one=>one.employer !==null))

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filteredData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData]);

  useEffect(() => {
    setTotalPage(Math.ceil(filteredData?.length / PageSize));
  }, [filteredData]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Browse Companies </title>
      </Helmet>
      <div className="h-full text-[#25324b] py-4 md:p-8 text-sm w-full">
        <div className="py-5 border mb-2 flex flex-col md:flex-row px-2">
          <div className="flex items-center relative border-b py-2 px-6 mx-4 w-full ">
            <input
              type="text"
              placeholder="Search messages"
              onChange={(e) => setcompanyName(e.target.value)}
              value={companyName}
              className="pl-[10px] focus:outline-none w-full"
            />
            <span className="absolute text-primary top-0 left-0 p-2">
              <CiSearch size={20} />
            </span>
          </div>
          {/* <div className="flex items-center relative border-b py-2 px-6 mx-4 w-full md:w-[35%]">
            <select
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-[10px] focus:outline-none w-full"
            >
              <option value={""} id={"030"}>
                -- select location --
              </option>
              {State.getStatesOfCountry("NG").map((current, index) => (
                <option key={index} value={current.name} id={current.name}>
                  {current.name}
                </option>
              ))}
            </select>
            <span className="absolute text-primary top-0 left-0 p-2">
              <GrLocation size={20} />
            </span>
          </div> */}
          <button className="bg-green-700 text-white py-2 px-6 hover:bg-green-900 font-medium mt-2 md:mt-0">
            Search
          </button>
        </div>
        <div className="my-6">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-[20%] mb-4 md:mb-0">
              <div className="checks_container pr-5">
                <div className="mb-4">
                  <CompaniesCategory
                    setCompanySize={setCompanySize}
                    setIndustry={setIndustry}
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-[80%]">
              <div>
                <h4 className="font-bold text-base">All Companies</h4>
                <div className="flex justify-between mb-6">
                  <div>
                    <p>Showing {companies?.length} results</p>
                  </div>
                  <div className="flex">
                    <div className="flex mr-3">
                      <span>Sorted by: </span>
                      <button className="flex">
                        <span className="mx-2 font-medium items-center">
                          Most relevant
                        </span>
                        {/* <span>
                          <FaChevronDown size={10} />
                        </span> */}
                      </button>
                    </div>
                    <div className="border-l px-2 flex items-center">
                      <button
                        onClick={() => setIsGrid(true)}
                        className="bg-gray-200 rounded p-1 mx-2"
                      >
                        {isGrid ? (
                          <BsGridFill className="prime_text" />
                        ) : (
                          <BsGrid />
                        )}
                      </button>
                      <button
                        onClick={() => setIsGrid(false)}
                        className="bg-gray-200 rounded p-1"
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
                {companies && (
                  <div className="min-h-full overflow-y-auto thin_scroll_bar">
                    {isGrid ? (
                      <div className="grid grid-cols-responsive gap-4">
                        {currentTableData?.map(({employer}) => (
                          <CompanyGridCard
                            key={employer.id}
                            company={employer}
                            newApplicant={newApplicant}
                          />
                        ))}
                      </div>
                    ) : (
                      <div>
                        {currentTableData?.map(({employer}) => (
                          <CompanyCard
                            key={employer.id}
                            company={employer}
                            newApplicant={newApplicant}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {companies && (
                <div className="mt-5">
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

export default Companies;
