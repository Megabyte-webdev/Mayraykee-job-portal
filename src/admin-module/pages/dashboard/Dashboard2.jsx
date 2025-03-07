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

function Dashboard2() {
  const { authDetails } = useContext(AuthContext);
  const { setSideBar } = useContext(AdminRouteContext);
  const { profileDetails, getAdminProfile } = useContext(
    AdminManagementContext
  );

  const [availablityStatus, setAvailabiltyStatus] = useState();

  const filterVerificationDetails =
    profileDetails &&
    Object.keys(profileDetails).filter(
      (currentKey) =>
        currentKey == "guarantor_verification_status" ||
        currentKey == "residence_verification_status" ||
        currentKey == "medical_history_verification_status" ||
        currentKey == "police_report_verification_status" ||
        currentKey == "previous_employer_verification_status"
    );

  const navigate = useNavigate();
  const navigateToPage = (route, index) => {
    navigate(route);
    setSideBar(index);
  };

  useEffect(() => {
    setAvailabiltyStatus(() => {
      if (profileDetails && profileDetails["availability_status"]) {
        return profileDetails["availability_status"] == "1" ? true : false;
      } else {
        return false;
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | Dashboard</title>
      </Helmet>
      <div className="h-full py-6 w-full text-sm text-gray-800">
        <div className="text-sm">
          <div className="flex justify-between">
            <div className="">
              <h4 className="font-bold text-2xl mb-2  ">
                Welcome back, {authDetails?.user?.first_name}{" "}
                {authDetails?.user?.surname}
              </h4>
              <p>
                Here a summary of your recent activities {generateDateRange()}
              </p>
            </div>
            <div>
              <button className="border p-2 hidden md:flex items-center">
                {" "}
                {generateDateRange()}
                <RiCalendarEventLine className="ml-2 " size={15} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            <DashboardCard
              rightIcon={<RiFileUserFill />}
              title="245 CV"
              subtitle="Total CV"
            />
            <DashboardCard
              leftIcon={<FiUsers />}
              title="452"
              subtitle="Total Employees"
              smallText="2 new Ad-hoc staff added"
              smallTextIcon={<FaPlus />}
            />
            <DashboardCard
              leftIcon={<BsStopwatch />}
              title="360"
              subtitle="On Time"
              smallText="-10% Less Duty Pst"
              smallTextIcon={<FaArrowTrendUp />}
            />
            <DashboardCard
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
            />
          </div>
        </div>

        {/* <div className="mt-5 !mb-32">
          <DashboardChart />
        </div> */}
      </div>
    </>
  );
}

export default Dashboard2;
