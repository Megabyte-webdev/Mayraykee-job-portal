import { Helmet } from "react-helmet";
import StatsCardWrapper from "../../components/home/StatsCardWrapper";
import JobStatsAndSummary from "../../components/home/JobStatsAndSummary";
import JobStatistic from "../../components/home/JobStatistic";
import JobOpen from "../../components/home/JobOpen";
import ApplicantSummary from "../../components/home/ApplicantSummary";
import JobUpdates from "../../components/home/JobUpdates";
import useJobManagement from "../../../hooks/useJobManagement";
import { useContext, useState, useMemo } from "react";
import { AuthContext } from "../../../context/AuthContex";
import { ApplicationContext } from "../../../context/ApplicationContext";
import { useEffect } from "react";
//import { JobContext } from "../../../context/JobContext";
import { stages } from "../../../utils/constants";
import { CompanyRouteContext } from "../../../context/CompanyRouteContext";
import { generateDateRange } from "../../../utils/formmaters";
import SubscriptionOffer from "../../../components/SubsciptionOffer";
import useApplicationManagement from "../../../hooks/useApplicationManagement";
import useCompanyProfile from "../../../hooks/useCompanyProfile";

function Home() {
  const { authDetails } = useContext(AuthContext);
  const jobUtils = useJobManagement();
  
  const { setSideBar } = useContext(CompanyRouteContext);
  const { getApplicantsByEmployee, applicants } = useApplicationManagement()
  const { jobList } = jobUtils;
  const { details } = useCompanyProfile();
  const openJobs = useMemo(() => 
    jobList?.filter((current) => current.status === "1" || current.status === "approved"),
    [jobList]
  );

  const value = useMemo(() => {
    return applicants?.reduce((acc, current) => {
      if (!acc[current.job_id]) acc[current.job_id] = [];
      acc[current.job_id].push(current);
      return acc;
    }, {});
  }, [applicants]);

  /*const applicantToReview = useMemo(
    () =>
      applicants?.filter(
        (current) =>
          current.status === stages[0].name || current.status === "pending"
      ),
    [applicants]
  );*/

  useEffect(() => {
    getApplicantsByEmployee();
    setSideBar(0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Company Dashboard | Home</title>
      </Helmet>
      <div className="h-fit w-full py-5 gap-[15px] flex flex-col">
        <SubscriptionOffer />
        <WelcomeMessage name={details?.company_name ? details?.company_name : authDetails?.user?.name} />
        <StatsCardWrapper applicants={applicants}  />
        <JobStatsAndSummary>
          <JobStatistic applicants={applicants} byCategory={value} />
          <div className="flex flex-col w-full md:w-[30%] h-fit md:h-full justify-between">
            <JobOpen data={openJobs} />
            <ApplicantSummary applicants={applicants} byCategory={value} jobs={jobUtils.jobList} />
          </div>
        </JobStatsAndSummary>
        {applicants && (
          <JobUpdates jobs={jobUtils.jobList} applicants={applicants} />
        )}
      </div>
    </>
  );
}

const WelcomeMessage = ({ name }) => (
  <div className="w-full flex justify-between">
    <div className="flex flex-col gap-[5px]">
      <h2 className="font-semibold text-lg">Welcome back, {name.split(" ")[0]}</h2>
      <span className="text-little text-gray-400">
        Here is your job listings statistic report from {generateDateRange()}.
      </span>
    </div>
  </div>
);

export default Home;
