import { lazy, useContext, useEffect, useReducer, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ApplicantReducer from "../reducers/ApplicantReducer";
import { applicantOptions, utilOptions } from "../utils/constants";
import { AuthContext } from "../context/AuthContex";
import { clear } from "idb-keyval";
import { ApplicantRouteContextProvider } from "../context/ApplicantRouteContext";
import { ref, set } from "firebase/database";
import { database } from "../utils/firebase";
import StaffInformation from "../staff-module/pages/verifications/StaffInformation";
import CartedStaffs from "../components/staffs/CartedStaffs";
import ApplicantDetails from "../components/applicant-details-ui/ApplicantDetails";
import AllApplication from "../components/applicant-details-ui/AllApplication";
import Application from "../components/applicant-details-ui/Application";
import withApplicationStatus from "../hocs/withApplicationStatus";
//Util Components
const NavBar = lazy(() => import("../applicant-module/components/NavBar"));
const SideBar = lazy(() => import("../applicant-module/components/SideBar"));
const SideBarItem = lazy(() =>
  import("../applicant-module/components/SideBarItem")
);

//Route Pages
const Home = lazy(() => import("../applicant-module/pages/home/Home"));
const Messages = lazy(() =>
  import("../applicant-module/pages/messages/Messages")
);
const Applications = lazy(() =>
  import("../applicant-module/pages/applications/Applications")
);
const FindJob = lazy(() => import("../applicant-module/pages/jobs/FindJob"));
const JobDetails = lazy(() =>
  import("../applicant-module/pages/job-details/JobDetails")
);
const Companies = lazy(() =>
  import("../applicant-module/pages/companies/Companies")
);
const CompanyDetails = lazy(() =>
  import("../applicant-module/pages/company-details/CompanyDetails")
);
const PublicProfile = lazy(() =>
  import("../applicant-module/pages/profile/PublicProfile")
);
const MyResume = lazy(() =>
  import("../applicant-module/pages/resume/MyResume")
);

const Artisan = lazy(() => import("../applicant-module/pages/artisan/Artisan"));
const DomesticStaffs = lazy(() =>
  import("../applicant-module/pages/staffs/DomesticStaffs")
);
const SuccessPage = lazy(() => import("../components/SuccessPage"));
const StaffDetails = lazy(() => import('../components/applicant-details-ui/ApplicantDetails'))
const ContractHistory = lazy(() => import('../components/staffs/ContractHistory'))


const ShortListedDetails = lazy(() =>
  import("../applicant-module/pages/shortlisted/ShortListedDetails")
);
const NotFound = lazy(() => import("../applicant-module/pages/404"));
const Settings = lazy(() =>
  import("../applicant-module/pages/settings/Settings")
);
const HelpCenter = lazy(() => import("../pages/HelpCenter"));
const BlogList = lazy(() => import("../pages/BlogList"));
const BlogRead = lazy(() => import("../pages/BlogRead"));
function useApplicantRoute() {
  const { authDetails } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [redirectState, setRedirectState] = useState();

  const toogleIsOpen = () => setIsOpen(!isOpen);
  const options=[...applicantOptions, ...utilOptions]
  const [state, dispatch] = useReducer(ApplicantReducer, options[0]);
  const { pathname }=useLocation();
  
 useEffect(() => {
    const matchedOption = options.find((opt) => pathname===opt?.route);
    if (matchedOption) {
      dispatch(matchedOption);
    }else{
dispatch(options[0]);
    }
  }, [pathname]);
  
  useEffect(() => {
    const clearDb = async () => await clear();

    const onlineStatusRef = ref(
      database,
      "online-status/" + `candidate-${authDetails?.user.id}`
    );

    const handleUnload = () => {
      clearDb();
      set(onlineStatusRef, {
        isOnline: false,
        timeStamp: new Date().toDateString(),
      });
    };

    set(onlineStatusRef, {
      isOnline: true,
      timeStamp: new Date().toDateString(),
    });

    window.addEventListener("unload", handleUnload);

    return () => {
      handleUnload();
      window.removeEventListener("unload", handleUnload);
    };
    
  }, []);

  return authDetails?.user.role === "candidate" ? (
    <ApplicantRouteContextProvider>
      <main className="h-screen w-screen relative flex overflow-hidden">
          {/* Side bar takes up 20% of total width and 100% of height */}
          <SideBar
            authDetails={authDetails}
            toogleIsOpen={toogleIsOpen}
            isMenuOpen={isOpen}
          >
            <ul className="flex flex-col gap-[10px]">
              {applicantOptions.map((currentOption) => (
                <SideBarItem
                  key={currentOption.type}
                  data={currentOption}
                  dispatch={dispatch}
                  state={state}
                  setIsOpen={setIsOpen}
                />
              ))}
            </ul>

            <ul className="flex flex-col gap-[10px]">
              {utilOptions.map((currentOption) => (
                <SideBarItem
                  key={currentOption.type}
                  data={currentOption}
                  dispatch={dispatch}
                  state={state}
                  setIsOpen={setIsOpen}
                />
              ))}
            </ul>
          </SideBar>

          {/* Routes and dashboard take up 80% of total width and 100% of height*/}
          <div className="flex-1 w-2/3 relative flex divide-y-2 divide-secondaryColor bg-white flex-col h-full">
            <NavBar
              state={state}
              toogleIsOpen={toogleIsOpen}
              isMenuOpen={isOpen}
            />
            <div className="flex-1 w-full h-[92%] overflow-y-auto px-2 lg:px-4">
              <Routes>
                <Route index element={<Home />} />
                <Route path="*" element={<NotFound />} />

                <Route path="messages" element={<Messages />} />
                <Route path="applications" element={<Applications />} />
                <Route
                  path="applications/:id"
                  element={<ShortListedDetails />}
                />
                <Route path="find-job" element={<FindJob />} />
                <Route path="find-job/:id" element={<JobDetails />} />
                <Route path="browse-companies" element={<Companies />} />
                <Route
                  path="browse-companies/:id"
                  element={<CompanyDetails />}
                />

                <Route path="artisan" element={<Artisan />} />
                <Route path="domestic-staffs" element={<DomesticStaffs />} />
                <Route path="staff/cart" element={<CartedStaffs />} />
                <Route path=":category/:id" element={<StaffDetails />} />
                <Route path="staff/cart" element={<CartedStaffs />} />
                <Route path="staff/success" element={<SuccessPage />} />
                <Route path="staff/contract-history" element={<ContractHistory />}/>  
                 
                {/* testing routes */}
                <Route path="applicant-detail" element={<ApplicantDetails />} />
                <Route path="application-detail" element={<AllApplication />} />
                <Route
                  path="application-detail/:id"
                  element={<Application />}
                />
                <Route path="/blogs" element={<BlogList general={false} direct="/applicant/" />} />
                <Route path="/blogs/:id" element={<BlogRead general={false} />} />
         

                {/* <Route
                  path="staff/:category/:id"
                  element={<StaffInformation />}
                />
                <Route path="success" element={<SuccessPage />} /> */}

                <Route path="public-profile" element={<PublicProfile />} />
                <Route path="setting" element={<Settings />} />
                <Route path="my-resume" element={<MyResume />} />
                <Route path="help-center" element={<HelpCenter />} />
              </Routes>
            </div>
          </div>
      </main>
    </ApplicantRouteContextProvider>
  ) : (
    <Navigate to={"/"} replace />
  );
}

export default useApplicantRoute;
