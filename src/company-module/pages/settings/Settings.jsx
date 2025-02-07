// import { useState } from "react";
// import Header from "../../components/job-listing/Header";
// import JobDetails from "../../components/job-listing/JobDetails";
// import Analytics from "../../components/job-listing/Analytics";
// import Overview from "../../components/settings/Notification";
// import SocialLinks from "../../components/settings/SocialLinks";
// import Team from "../../components/settings/Team";

const options = [
  {
    id: 1,
    name: "Overview",
  },
];

import React, { useContext, useState } from 'react'
// import BasicInfo from './components/BasicInfo';
// import ApplicantLoginDetails from './components/ApplicantLoginDetails';
import { AuthContext } from '../../../context/AuthContex';
import Notification from "../../components/settings/Notification";
import UpdateCompanyProfileModal from "../../components/company-profile/UpdateCompanyProfileModal";
import useCompanyProfile from '../../../hooks/useCompanyProfile';

const Settings = () => {
  const { authDetails } = useContext(AuthContext);
  const [currentOption, setCurrentOption] = useState(options[0]);
  const companyHookProps = useCompanyProfile();
  const [isOpen, setIsOpen] = useState(false);
  const getComponent = () => {
    switch (currentOption.id) {
      case options[0].id:
        return <Notification />;
    }
  };

  const user = authDetails?.user
  const [active, setActive] = useState("profile")
  const handleActive = (event) => setActive(event);
  return (
    <div className="h-full text-[#25324b] w-full">
      <div className="mt-6">
        <div className="sticky top-0 flex border-b pt-4 bg-white">
          <button onClick={() => handleActive("profile")} className={`p-2 mx-3 border-green-700 ${active === "profile" ? "border-b-2 font-medium" : ""}`}>Company Profile</button>
          <button onClick={() => handleActive("notifications")} className={`p-2 mx-3 border-green-700 ${active === "notifications" ? "border-b-2 font-medium" : ""}`}>Notifications</button>
          {/* <button onClick={() => handleActive("notification")} className={`p-2 mx-3 border-green-700 ${active === "notification" ? "border-b-2 font-medium" : ""}`}>Notifications</button> */}
        </div>
        <div className="my-5 px-5">
          {active === "profile" &&
            <UpdateCompanyProfileModal
              isOpen={true}
              setIsOpen={setIsOpen}
              plain={true}
              companyHookProps={companyHookProps} />}
          {active === "notifications" && (
            <div className="w-full py-2 flex flex-col gap-[20px]">
              <h1 className="font-semibold"> Notification Settings </h1>
              {getComponent()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
