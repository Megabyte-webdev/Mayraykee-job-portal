import { Helmet } from "react-helmet";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaPlus,
} from "react-icons/fa6";
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

function Employers() {
  const { authDetails } = useContext(AuthContext);
  const { setSideBar } = useContext(AdminRouteContext);
  const { getEmployers } = UseAdminManagement();
  
  const [employersCount, setEmployersCount] = useState(0);
  const [pending, setPending] = useState(0);
  const navigate = useNavigate();
  const navigateToPage = (route, index) => {
    navigate(route);
    setSideBar(index);
  };

  useEffect(() => {
    (async () => {
      const employers = await getEmployers();
      setEmployersCount(employers.length);
      const pendingEmployers = employers.filter(employer => employer.status === 'pending');
      setPending(pendingEmployers.length);
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | Employers </title>
      </Helmet>
      <div className="h-full py-6 w-full text-sm text-gray-800">
        <div className="text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {/* <DashboardCard
              rightIcon={<RiFileUserFill />}
              title="245 CV"
              subtitle="Total CV"
            /> */}
            <DashboardCard
              leftIcon={<FiUsers />}
              title={employersCount}
              subtitle="Total Registered Employers"
              smallText="2 new Ad-hoc staff added"
              smallTextIcon={<FaPlus />}
              link={"/admin/employers/all"}
            />
            <DashboardCard
              leftIcon={<BsStopwatch />}
              title={pending}
              subtitle="Pending Employers"
              smallText="-10% Less Duty Pst"
              smallTextIcon={<FaArrowTrendUp />}
            />
            {/* <DashboardCard
              leftIcon={<TbCalendarClock />}
              title="42"
              subtitle="On Time"
              smallText="+2% Increase Ad-hoc staff at duty posts"
              smallTextIcon={<FaArrowTrendUp />}
            /> */}
            {/* <DashboardCard
              leftIcon={<BsStopwatch />}
              title="627"
              subtitle="Health insurance"
              smallText="+3% increase than yesterday"
              smallTextPIcon={<FaArrowTrendDown />}
              smallTextIconColor="text-red-500"
            />
            <DashboardCard
              leftIcon={<BsStopwatch />}
              title="5000"
              subtitle="Monthly Report"
              smallText="10% Generated"
              smallTextIcon={<FaArrowTrendUp />} */}
            {/* /> */}
          </div>
        </div>
{/* 
        <div className="mt-5 !mb-32">
          <DashboardChart />
        </div> */}
      </div>
    </>
  );
}

export default Employers;