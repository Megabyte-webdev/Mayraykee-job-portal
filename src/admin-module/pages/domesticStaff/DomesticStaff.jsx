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

function DomesticStaff() {
  const { authDetails } = useContext(AuthContext);
  const { setSideBar } = useContext(AdminRouteContext);
  const { getDomesticStaff } = UseAdminManagement();
  
  const [domesticsCount, setDomesticsCount] = useState(0);
  const [pending, setPending] = useState(0);
  const navigate = useNavigate();
  const navigateToPage = (route, index) => {
    navigate(route);
    setSideBar(index);
  };

  useEffect(() => {
    (async () => {
      const domesticStaff = await getDomesticStaff();
      setDomesticsCount(domesticStaff.length);
      const pendingDomestics = domesticStaff.filter(domestic => domestic.status === 'pending');
      setPending(pendingDomestics.length);
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | Domestic Staff </title>
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
              title={domesticsCount}
              subtitle="Total Registered Domestic Staff"
              smallText="2 new Ad-hoc staff added"
              smallTextIcon={<FaPlus />}
              link={"/admin/domestic-staff/all"}
            />
            <DashboardCard
              leftIcon={<BsStopwatch />}
              title={pending}
              subtitle="Pending Domestic Staff"
              smallText="-10% Less Duty Pst"
              smallTextIcon={<FaArrowTrendUp />}
            />
            
          </div>
        </div>

      </div>
    </>
  );
}

export default DomesticStaff;
