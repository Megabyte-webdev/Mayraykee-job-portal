import { Helmet } from "react-helmet";
import docsIcon from "../../../assets/pngs/doc-vector.png";
import chatsIcon from "../../../assets/pngs/multiple-chat.png";
import RoundChart from "../../components/charts/RoundCharts";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlineMoreHoriz,
  MdOutlineRateReview,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import newApplicant from "../../../assets/pngs/applicant-logo1.png";
import RecentlyAdded from "./RecentlyAdded";
import { motion } from "framer-motion";
import { fadeIn, fadeInXaxis } from "../../../utils/variants";
import { RiCalendarEventLine } from "react-icons/ri";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContex";
import FirstUpdateForm from "../../components/first-update/FirstUpdateForm";
import { ResourceContext } from "../../../context/ResourceContext";
import { BASE_URL } from "../../../utils/base";
import Interview from "./components/Interview";
import axios from "axios";
import { ApplicantRouteContext } from "../../../context/ApplicantRouteContext";
import { useNavigate } from "react-router-dom";

const now = new Date();
function Home() {
  const {
    getAllApplications,
    setGetAllApplications,
    getAllJobs,
    setGetAllJobs,
  } = useContext(ResourceContext);
  const { authDetails, userUpdate } = useContext(AuthContext);
  const { setSideBar } = useContext(ApplicantRouteContext);
  const hour = now.getHours();
  const user = authDetails?.user;
  const navigate = useNavigate();

  const currentDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  let timeOfDay = "";
  if (hour > 16) {
    timeOfDay = "Evening";
  } else if (hour > 11 && hour < 17) {
    timeOfDay = "Afternoon";
  } else {
    timeOfDay = "Morning";
  }

  function generateDateRange() {
    const today = new Date();
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);

    // Format dates as "Month Day, Year"
    const formattedStartDate = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedEndDate = oneWeekLater.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return `${formattedStartDate} - ${formattedEndDate}.`;
  }

  const navigateToApplications = () => {
    navigate("/applicant/applications");
    setSideBar(3);
  };

  useEffect(() => {
    setGetAllJobs((prev) => {
      return {
        ...prev,
        isDataNeeded: true,
      };
    });
  }, []);

  console.log(userUpdate);

  useEffect(() => {
    setGetAllApplications((prev) => {
      return {
        ...prev,
        isDataNeeded: true,
      };
    });
  }, []);

  const allApplications = getAllApplications?.data;
  const pendingReview = allApplications?.filter(
    (app) => app.status === "in-review"
  );
  const shortlistedReview = allApplications?.filter(
    (app) => app.status === "shortlist"
  );

  const getInterviews = (id, setState) => {
    axios
      .get(`${BASE_URL}/interviews/${id}`, {
        headers: {
          Authorization: `Bearer ${authDetails.token}`,
        },
      })
      .then((response) => {
        // console.log(response)
        setState(response.data.interview);
        // onSuccess({
        //     message: 'New Application',
        //     success: response.data.message
        // })
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setErrorMsg(error.response.data.message);
        } else {
          console.log(error);
          setErrorMsg(error.message);
        }
      });
  };

  // console.log(allApplications)
  return (
    <>
      <Helmet>
        <title>Dashboard | Home</title>
      </Helmet>
      <FirstUpdateForm />
      <div className="h-full p-6 w-full text-sm text-gray-800">
        <div className="text-sm">
          <div className="flex justify-between ">
            <div className="">
              <h4 className="font-bold text-2xl mb-2  ">
                Good {timeOfDay}, {user.first_name}
              </h4>
              <p>
                Here is what’s happening with your job search applications from{" "}
                {generateDateRange()}
              </p>
            </div>
            {/* <div>
              <button className="border p-2 hidden md:flex items-center">
                {" "}
                {generateDateRange()}
                <RiCalendarEventLine className="ml-2 " size={15} />
              </button>
            </div> */}
          </div>
          <div className="md:flex-row flex-col flex  mt-8 gap-2">
            <div className=" w-full md:w-[17%]  flex justify-between md:flex-col ">
              <div className="pb-1 h-full md:w-full w-[45%] md:h-1/2">
                <div
                  onClick={navigateToApplications}
                  className="border text-white transition duration-400 bg-lightgreen h-full cursor-pointer mb-4 p-3 pb-0 flex flex-col justify-between"
                >
                  <p className="font-bold">Total Jobs Applied for</p>
                  <div className="flex justify-between items-end mt-">
                    <p className="text-6xl font-medium">
                      {getAllApplications.data?.length}
                    </p>
                    <div className="">
                      <img src={docsIcon} alt="" className="w-5" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-1 h-full md:w-full w-[45%]  md:h-1/2">
                <div
                  onClick={navigateToApplications}
                  className="border bg-yellow-500 text-white transition duration-400 h-full cursor-pointer mb-4 p-3 pb-0 flex flex-col justify-between"
                >
                  <p className="font-bold">Interviewed</p>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-6xl font-medium">0</p>
                    <div className="">
                      <img src={chatsIcon} alt="" className="w-[60px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" w-full md:w-[17%]  flex justify-between md:flex-col ">
              <div className="pt-1 h-full md:w-full w-[45%]  md:h-1/2">
                <div
                  onClick={navigateToApplications}
                  className="border  bg-orange-500 text-white transition duration-400 h-full cursor-pointer mb-4 p-3 pb-0 flex flex-col justify-between"
                >
                  <p className="font-bold">In-Review</p>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-6xl font-medium">
                      {pendingReview?.length}
                    </p>
                    <div className=" text-gray-300">
                      <MdOutlineRateReview size={50} />
                      {/* <img src={docsIcon} alt="" className="w-10" /> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-1 h-full md:w-full w-[45%]  md:h-1/2">
                <div
                  onClick={navigateToApplications}
                  className="border bg-lightblue text-white transition duration-400 h-full cursor-pointer mb-4 p-3 pb-0 flex flex-col justify-between"
                >
                  <p className="font-bold">Shortlisted</p>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-6xl font-medium">
                      {shortlistedReview?.length}
                    </p>
                    <div className=" text-gray-300">
                      <MdOutlineRemoveRedEye size={50} />
                      {/* <img src={chatsIcon} alt="" className="w-[60px]" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-center md:w-[25%] bg-primaryColor text-white border">
              <div className=" p-3">
                <p className="font-bold">Jobs Application Status</p>
                <div className="my-5 flex items-center">
                  <div className="">
                    <RoundChart />
                  </div>
                  {/* <div className="w-2/5">
                    <div className="flex items-center">
                      <div className="size-3 rounded bg-[#0F5A02] mr-3"></div>
                      <div className="mb-2">
                        <p className="font-bold">60%</p>
                        <p>Unsuitable</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="size-3 rounded bg-[#E9EBFD] mr-3"></div>
                      <div className="mb-2">
                        <p className="font-bold">40%</p>
                        <p>Interviewed</p>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="flex my-3  items-center font-bold cursor-pointer hover:opacity-90">
                  <p onClick={()=>{scrollTo(0,0); navigate("/applicant/applications")}}>View All Applications</p>
                  <span className="ml-2">
                    {" "}
                    <FaArrowRightLong />
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[50%] font-medium border py-3 text-sm">
              <div className="px-3 border-b">
                <p className="font-bold my-3">Upcomming Interviews</p>
              </div>
              <div className="px-3 flex border-b justify-between items-center">
                <p className=" my-3">
                  <b>Today</b>, {currentDate}
                </p>
                <div className="flex">
                  <span className="mr-2">
                    <MdChevronLeft />{" "}
                  </span>
                  <span>
                    <MdChevronRight />{" "}
                  </span>
                </div>
              </div>
              {/* <div className="px-3 my-3 flex items-center">
                <p className="w-1/6 font-medium">10:00 AM</p>
                <p className="border-b w-5/6 pt-1"> </p>
              </div> */}
              <div className="overflow-y-scroll max-h-[250px] no_scroll_bar">
                {shortlistedReview?.map((shortListed) => (
                  <Interview
                    key={shortListed.id}
                    getInterviews={getInterviews}
                    shortListed={shortListed}
                  />
                ))}
              </div>
              {/* <div className="px-3 my-3 flex items-center">
                <p className="w-1/6 font-medium">10:30 AM</p>
                <div className="bg-[#47AA4933] rounded w-5/6 p-3">
                  <div className="flex items-center">
                    <div className="size-12 mr-3 rounded-full bg-gray-100"></div>
                    <div className="w-80 divide-y-1 divide-inherit">
                      <p className="prime_text border-b border-4 font-medium">Joe Bartmann</p>
                      <p className="font-bold">HR Manager at Divvy</p>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="px-3 my-3 flex items-center">
                <p className="w-1/6 font-medium">11:00 AM</p>
                <p className="border-b w-5/6 pt-1"> </p>
              </div> */}
            </div>
          </div>
        </div>
        <div className="my-8">
          <div className="border">
            <div className="p-3 border-b">
              <p className="font-bold text-base">Recent Application History</p>
            </div>
            <div className="p-3 h-[40vh] overflow-y-auto no_scroll_bar">
              {allApplications?.map((app) => (
                <RecentlyAdded
                  key={app.id}
                  app={app.id}
                  newApp={app}
                  newApplicant={newApplicant}
                />
              ))}
              <div className="my-4 flex justify-center">
                <div className="flex my-3 items-center cursor-pointer prime_text hover:opacity-90">
                  <p>View All Applications</p>
                  <span className="ml-2">
                    {" "}
                    <FaArrowRightLong />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
