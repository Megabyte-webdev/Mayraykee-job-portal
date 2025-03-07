import { Helmet } from "react-helmet";
import docsIcon from "../../../assets/pngs/doc-vector.png";
import chatsIcon from "../../../assets/pngs/multiple-chat.png";
import {
  FaArrowRightLong,
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
import { StaffManagementContext } from "../../../context/StaffManagementModule";
import DefaultSwitch from "../../../components/DefaultSwitch";
import { AdminRouteContext } from "../../../context/AdminRouteContext";
import { AdminManagementContext } from "../../../context/AdminManagementModule";
import DashboardCard from "../../components/dashboard/DashboardCards";
import { BsStopwatch } from "react-icons/bs";
import { TbCalendarClock } from "react-icons/tb";
import DashboardChart from "../../components/dashboard/DashboardChart";
import UseAdminManagement from "../../../hooks/useAdminManagement";

function Artisan() {
  const { authDetails } = useContext(AuthContext);
  const { setSideBar } = useContext(AdminRouteContext);
  const { getArtisans } = UseAdminManagement();



  const [availablityStatus, setAvailabiltyStatus] = useState();
  const [artisanCount, setArtisanCount] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    (async () => {
      const artisans = await getArtisans();
      console.log(artisans);
      setArtisanCount(artisans.length);
      const pendingArtisans = artisans.filter(artist => artist.status === 'pending');
      setPending(pendingArtisans.length);
    })();
  }, []);



  const navigate = useNavigate();
  const navigateToPage = (route, index) => {
    navigate(route);
    setSideBar(index);
  };

  return (
    <>
      <Helmet>
        <title>Admin| Artisans</title>
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
              title={artisanCount}
              subtitle="Total Registered Artisans"
              smallText="2 new Ad-hoc staff added"
              smallTextIcon={<FaPlus />}
              link={"/admin/artisans/all"}
            />
            <DashboardCard
              leftIcon={<BsStopwatch />}
              title={pending}
              subtitle="Pending Artisans"
              smallText="-10% Less Duty Pst"
              smallTextIcon={<FaArrowTrendUp />}
            />
            {/* <DashboardCard
              leftIcon={<TbCalendarClock />}
              title="42"
              subtitle="On Time"
              smallText="+2% Increase Ad-hoc staff at duty posts"
              smallTextIcon={<FaArrowTrendUp />}
            />
            <DashboardCard
              leftIcon={<BsStopwatch />}
              title="627"
              subtitle="Health insurance"
              smallText="+3% increase than yesterday"
              smallTextIcon={<FaArrowTrendDown />}
              smallTextIconColor="text-red-500"
            />
            <DashboardCard
              leftIcon={<BsStopwatch />}
              title="5000"
              subtitle="Monthly Report"
              smallText="10% Generated"
              smallTextIcon={<FaArrowTrendUp />}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Artisan;
