import { Helmet } from "react-helmet";
import { FaArrowTrendDown, FaArrowTrendUp, FaPlus } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { RiCalendarEventLine, RiFileUserFill } from "react-icons/ri";
import { generateDateRange } from "../../../utils/formmaters";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContex";
import { useNavigate } from "react-router-dom";
import { AdminRouteContext } from "../../../context/AdminRouteContext";
import DashboardCard from "../../components/dashboard/DashboardCards";
import { BsStopwatch } from "react-icons/bs";
import { TbCalendarClock } from "react-icons/tb";
import DashboardChart from "../../components/dashboard/DashboardChart";
import UseAdminManagement from "../../../hooks/useAdminManagement";

function Dashboard() {
  const { authDetails } = useContext(AuthContext);
  const { setSideBar } = useContext(AdminRouteContext);
  const {
    getEmployers,
    getCandidates,
    getArtisans,
    getDomesticStaff,
    getAllJobs,
  } = UseAdminManagement();

  const [employersCount, setEmployersCount] = useState(0);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [artisansCount, setArtisansCount] = useState(0);
  const [domesticStaffCount, setDomesticStaffCount] = useState(0);
  const [jobLearningCount, setJobLearningCount] = useState(0);

  const navigate = useNavigate();
  const navigateToPage = (route, index) => {
    navigate(route);
    setSideBar(index);
  };

  useEffect(() => {
    (async () => {
      const employers = await getEmployers();
      setEmployersCount(employers.length);

      const candidates = await getCandidates();
      setCandidatesCount(candidates.length);

      const artisans = await getArtisans();
      setArtisansCount(artisans.length);

      const domesticStaff = await getDomesticStaff();
      setDomesticStaffCount(domesticStaff.length);

      const jobLearning = await getAllJobs();
      setJobLearningCount(jobLearning.length);
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | Dashboard</title>
      </Helmet>
      <div className="h-full p-6 w-full text-sm text-gray-800">

        <div className="text-sm">
          <button 
          onClick={() => navigate('/admin-exclusives')}
          className="ml-4 px-2 py-2 bg-primaryColor font-semibold hover:scale-[102%] duration-75 rounded-md text-white">
            Manage Exlcusive Employers
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            <DashboardCard
              leftIcon={<BsStopwatch />}
              title={candidatesCount}
              subtitle="Corporate Candidates"
              smallText="2% Increase Ad-hoc staff at duty posts"
              smallTextIcon={<FaPlus />}
              link={"/admin/candidates/all"}
            />
            <DashboardCard
              leftIcon={<FiUsers />}
              title={employersCount}
              subtitle="Corporate Employers"
              smallText="2 new Ad-hoc staff added"
              smallTextIcon={<FaPlus />}
              link={"/admin/employers/all"}
            />
            <DashboardCard
              leftIcon={<BsStopwatch />}
              title={artisansCount}
              subtitle="Artisans"
              smallText="-10% Less Duty Pst"
              smallTextIcon={<FaArrowTrendUp />}
              link={"/admin/artisans/all"}
            />
            <DashboardCard
              leftIcon={<TbCalendarClock />}
              title={domesticStaffCount}
              subtitle="Domestic Staff"
              smallText="+2% Increase Ad-hoc staff at duty posts"
              smallTextIcon={<FaArrowTrendUp />}
              link={"/admin/domestic-staff/all"}
            />
            {/* <DashboardCard
              leftIcon={<BsStopwatch />}
              title={jobLearningCount}
              subtitle="E-learning"
              smallText="+3% increase than yesterday"
              smallTextIcon={<FaArrowTrendDown />}
              smallTextIconColor="text-red-500"
            /> */}
            <DashboardCard
              leftIcon={<BsStopwatch />}
              title={jobLearningCount}
              subtitle="Job Listing"
              smallText="10% Generated"
              smallTextIcon={<FaArrowTrendUp />}
              link={"/admin/jobs"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
