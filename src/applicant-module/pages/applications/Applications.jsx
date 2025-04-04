
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MdClose } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { BsFilter } from "react-icons/bs";
import noticeImg from "../../../assets/pngs/notice-icon.png";
import { ResourceContext } from "../../../context/ResourceContext";
import { AuthContext } from "../../../context/AuthContex";
import AllApplicants from "./components/AllApplicants";
import AllShortlistedApplicants from "./components/AllShortlistedApplication";
import {useLocation} from 'react-router-dom';
const stages=[
  { label: "All", key: "all" },
  { label: "Under-Review", key: "in-review" },
  { label: "Interviewed", key: "interview" },
  { label: "Shortlisted", key: "shortlist" },
  { label: "Declined", key: "declined" },
  { label: "Hired", key: "hired" },
]
function Application() {
  const location= useLocation();
  const { getAllApplications, setGetAllApplications } = useContext(ResourceContext);
  const { authDetails } = useContext(AuthContext);

  const [closeNote, setCloseNote] = useState(true);
  const [view, setView] = useState();
  const [appFilter, setAppFilter] = useState("");
  const [randomizedApplications, setRandomizedApplications] = useState([]);

  useEffect(() => {
    setGetAllApplications((prev) => ({
      ...prev,
      isDataNeeded: true,
    }));
    
  }, []);
  useEffect(() => {
    if(stages.find(one=> one.key === location?.state?.id) ){
      setView(location?.state?.id)
    }else{
      setView("all")
    }
  }, [location?.state]);

  // Clear randomized list on view change
  useEffect(() => {
    setRandomizedApplications([]);
  }, [view]);

  const generateDateRange = () => {
    const today = new Date();
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);

    return `${today.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - 
            ${oneWeekLater.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  // Filter by search keyword
  const filterByKeyword = getAllApplications?.data?.filter((item) =>
    item?.job_title?.toLowerCase().includes(appFilter.toLowerCase())
  );

  // Apply view-specific filtering and randomness
  const filteredApplications = (() => {
    let applications = filterByKeyword || [];
    if(view !== "all"){
      applications = applications?.filter((app) => app.status === view);
    }
    return randomizedApplications.length ? randomizedApplications : applications;
  })();

  // Randomize applications
  const randomizeApplications = () => {
    const randomized = [...filteredApplications].sort(() => Math.random() - 0.5);
    setRandomizedApplications(randomized);
  };

  // Get count based on status
  const getStatusCount = (status) => {
    if(status === "all") return filterByKeyword?.length;
    return filterByKeyword?.filter((app) => app.status === status).length || 0;
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | My Application </title>
      </Helmet>
      <div className="h-full py-8 w-full text-sm text-primary">
        <div className="text-sm">
          <div className="flex justify-between align-center">
            <div>
              <h4 className="font-semibold text-2xl mb-5">
                Keep it up, {authDetails.user?.first_name}
              </h4>
              <p>
                Here is what’s happening with your job search applications from{" "}
                {generateDateRange()}
              </p>
            </div>
          </div>
          <div className="my-6">
            {closeNote && (
              <div className="p-4 relative bg-[#47AA491A]">
                <div className="md:w-4/5">
                  <div className="flex">
                    <div>
                      <img src={noticeImg} alt="Notice" />
                    </div>
                    <div className="ml-3">
                      <p className="font-bold">New Feature</p>
                      <p>
                        You can request a follow-up 7 days after applying for a job if the
                        application status is in review. Only one follow-up is allowed per job.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCloseNote(false)}
                  className="absolute top-0 right-0 p-2 hover:bg-green-200"
                >
                  <MdClose size={20} />
                </button>
              </div>
            )}
          </div>
          <div className="flex border-b mb-6 min-w-full overflow-auto">
            {stages?.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`w-max mx-2 p-2 hover:text-gray-500 ${
                  view === key ? "sticky left-0 bg-gray-200 border-b-2 border-green-600 font-medium" : ""
                }`}
              >
                {label} ({getStatusCount(key)})
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-between items-center">
            <p className="font-bold capitalize">{view} Applications</p>
            <div className="flex items-start">
              <div className="relative border h-full py-1 px-6 mb-4">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setAppFilter(e.target.value)}
                  value={appFilter}
                  className="pl-[10px] focus:outline-none w-full"
                />
                <span className="absolute text-primary top-0 left-0 p-2">
                  <CiSearch />
                </span>
              </div>
              <button
                onClick={randomizeApplications}
                className="border px-2 py-1 mx-2 flex items-center hover:bg-gray-100"
              >
                <BsFilter className="mx-2 prime_text" size={20} /> Filter
              </button>
            </div>
          </div>
          <div className="w-full my-3 flex flex-col items-stretch overflow-x-auto">
            {filteredApplications.map((app, index) => (
                  <AllApplicants key={app.id} app={app} index={index} />
                ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Application;
