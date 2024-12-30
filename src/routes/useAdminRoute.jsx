import { lazy, useContext, useEffect, useReducer, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { adminOptions, adminnUtilOptions } from "../utils/constants";
import { AuthContext } from "../context/AuthContex";
import { clear } from "idb-keyval";
import StaffReducer from "../reducers/StaffReducer";
import { AdminManagementContextProvider } from "../context/AdminManagementModule";
import { AdminRouteContextProvider } from "../context/AdminRouteContext";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import AllCandidate from "../admin-module/pages/candidate/AllCandidate";
import CandidateDetails from "../admin-module/pages/candidate/CandidateDetails";
import JobsByEmployer from "../admin-module/pages/employers/JobsByEmployerDetails";
import AppliedJobs from "../admin-module/pages/employers/AppliedJobs";
import EmployerCandidates from "../admin-module/pages/employers/EmployerCandidates";
import EmployerStaff from "../admin-module/pages/employers/EmployerStaff";
import CandidateStaff from "../admin-module/pages/candidate/CandidateStaff";
import Sectors from "../admin-module/pages/settings/Sectors/Sectors";
import AddCategory from "../admin-module/pages/settings/Sectors/AddCategory";
import Currency from "../admin-module/pages/settings/Currency/curremcy";
import AddCurrency from "../admin-module/pages/settings/Currency/AddCurrency";
import JobListing from "../admin-module/pages/Jobs/JobListing";
import AllGuarantors from "../admin-module/pages/guarantors/AllGuarantors";
import AllMedicalHistories from "../admin-module/pages/medical-history/medicalHistory";
import AllPoliceReports from "../admin-module/pages/police-report/policeReport";
import AdminLogin from "../pages/AdminLogin";
import AdminForgotPassword from "../pages/AdminForgotPassword";
import AdminResetPwd from "../components/AdminAuth/AdminResetPwd";
import AdminRegistrationForm from "../components/AdminAuth/AdminSIgnupForm";
import AdminLogout from "../components/AdminAuth/AdminLogout";
import AdminSideBar from "../admin-module/components/AdminSideBar";
import AdminSideBarItem from "../admin-module/components/AdminSideBarItem";
import JobDescriptionPage from "../admin-module/pages/Jobs/JobDescriptionPage";
import AllJobs from "../admin-module/pages/Jobs/AllJobListing";
import AdminReducer from "../reducers/AdminReducer";
import Salaries from "../admin-module/pages/settings/Salary/Salaries";
import AddSalary from "../admin-module/pages/settings/Salary/AddSalary";
import AdminChangePassword from "../components/AdminAuth/AdminChangePwd";
import Security from "../admin-module/pages/settings/Security/security";
import AllDataJobsPostedEmployer from "../admin-module/pages/employers/AllJobsPostedByEmployer";
import JobsByEmployerDetails from "../admin-module/pages/employers/JobsByEmployerDetails";
import AllAdmins from "../admin-module/pages/settings/SuperAdmin/AllAdmin";

// Util Component
const NavBar = lazy(() => import("../admin-module/components/NavBar"));
const SideBar = lazy(() => import("../admin-module/components/SideBar"));
const SideBarItem = lazy(() => import("../admin-module/components/SideBarItem"));

// Pages
const Dashboard = lazy(() => import("../admin-module/pages/dashboard/Dashboard"));
const HelpCenter = lazy(() => import("../admin-module/pages/help-center/Help"));
const Settings = lazy(() => import("../admin-module/pages/settings/Settings"));
const Employers = lazy(() => import("../admin-module/pages/employers/Employers"));
const AllEmployers = lazy(() => import("../admin-module/pages/employers/AllEmployers"));
const EmployerDetails = lazy(() => import("../admin-module/pages/employers/EmployerDetails"));
const Artisan = lazy(() => import("../admin-module/pages/artisans/Artisans"));
const AllArtisans = lazy(() => import("../admin-module/pages/artisans/AllArtisans"));
const ArtisanDetails = lazy(() => import("../admin-module/pages/artisans/ArtisanDetails"));
const DomesticStaff = lazy(() => import("../admin-module/pages/domesticStaff/DomesticStaff"));
const AllDomesticStaff = lazy(() => import("../admin-module/pages/domesticStaff/AllDomesticStaff"));
const DomesticStaffDetails = lazy(() => import("../admin-module/pages/domesticStaff/DomesticStaffDetails"));
const Candidates = lazy(() => import("../admin-module/pages/candidate/Candidate"));
const Interviews = lazy(() => import("../admin-module/pages/Interviews"));
const Blogs = lazy(() => import("../admin-module/pages/blogs/ManageBlogs"));
const CreateBlog = lazy(() => import("../admin-module/pages/blogs/CreateBlog"));



function useAdminRoute() {
  const path = useLocation().pathname;
  // const [state, dispatch] = useReducer(AdminReducer, adminOptions.find((option) => option.route === path));
  const [state, dispatch] = useReducer(AdminReducer, adminOptions[0]);
  const { authDetails } = useContext(AuthContext);
  // const { changeTheme } = useContext(PrimeReactContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  

  const toogleIsOpen = () => setIsOpen(!isOpen);

  const setSideBar = (index) => {
    const page = adminOptions[index];
    dispatch({ ...page });
  };

  useEffect(() => {
    const clearDb = async () => await clear();

    const handleUnload = () => {
      clearDb();
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      handleUnload();
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  const hideNavBarRoutes = [
    "/admin/login",
    "/admin/reset-pwd",
    "/admin/settings/register",
    "/admin/forget-pwd",
    "/admin/change-pwd",
  ];

  const shouldHideNavBar = hideNavBarRoutes.includes(location.pathname);

  // const handleThemeChange = (newTheme) => {
  //   changeTheme('lara-light-blue', newTheme, 'theme-link', () => {
  //     console.log(`Theme changed to ${newTheme}`);
  //   });
  // };

  return (
    <>
      {true ? (
        <AdminManagementContextProvider>
          <AdminRouteContextProvider setSideBar={setSideBar}>
            <main className="h-screen w-screen relative flex">
              {/* Conditionally render the sidebar */}
              {!shouldHideNavBar && (
                <AdminSideBar
                  authDetails={authDetails}
                  toogleIsOpen={toogleIsOpen}
                  isMenuOpen={isOpen}
                >
                  <ul className="flex flex-col gap-[10px]">
                    {adminOptions.map((currentOption) => (
                      <AdminSideBarItem
                        key={currentOption.type}
                        data={currentOption}
                        dispatch={dispatch}
                        state={state}
                      />
                    ))}
                  </ul>

                  <ul className="flex flex-col gap-[10px]">
                    {adminnUtilOptions.map((currentOption) => (
                      <AdminSideBarItem
                        key={currentOption.type}
                        data={currentOption}
                        dispatch={dispatch}
                        state={state}
                      />
                    ))}
                  </ul>
                </AdminSideBar>
              )}

              {/* Routes and dashboard take up 80% of total width and 100% of height */}
              <div className={`relative flex divide-y-2 divide-secondaryColor bg-white flex-col h-full ${!shouldHideNavBar ? 'md:w-[82%] w-full' : 'w-full'}`}>
                {!shouldHideNavBar && (
                  <NavBar
                    state={state}
                    toogleIsOpen={toogleIsOpen}
                    isMenuOpen={isOpen}
                  />
                )}
                <div className="w-full h-[92%] overflow-y-auto">
                  <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
                    <Routes>
                      <Route path="login" element={<AdminLogin />} />
                      <Route path="logout" element={<AdminLogout />} />
                      <Route path="reset-pwd" element={<AdminResetPwd />} />
                      <Route path="settings/register" element={<AdminRegistrationForm />} />
                      <Route path="forget-pwd" element={<AdminForgotPassword />} />
                      <Route path="change-pwd" element={<AdminChangePassword />} />
                      <Route index element={<Dashboard />} />
                      <Route path="employers" element={<Employers />} />
                      <Route path="interviews" element={<Interviews />} />
                      <Route path="employers/all" element={<AllEmployers />} />
                      <Route path="employer/details/:id" element={<EmployerDetails />} />
                      <Route path="employer-jobs/details/:id" element={<JobsByEmployerDetails />} />
                      <Route path="employer/alljobs/:id" element={<AllDataJobsPostedEmployer />} />
                      <Route path="employer/applied-jobs/:id" element={<AppliedJobs />} />
                      <Route path="employer/:id/candidates" element={<EmployerCandidates />} />
                      <Route path="employer/:id/staffs" element={<EmployerStaff />} />
                      <Route path="domestic-staff" element={<DomesticStaff />} />
                      <Route path="domestic-staff/all" element={<AllDomesticStaff />} />
                      <Route path="domestic-staff/details/:id" element={<DomesticStaffDetails />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="settings/sectors" element={<Sectors />} />
                      <Route path="settings/sectors/categories" element={<AddCategory />} />
                      <Route path="settings/currency" element={<Currency />} />
                      <Route path="settings/currency/add" element={<AddCurrency />} />
                      <Route path="settings/salary" element={<Salaries />} />
                      <Route path="settings/salary/add" element={<AddSalary />} />
                      <Route path="settings/security" element={<Security />} />
                      <Route path="settings/security/admins" element={<AllAdmins />} />
                      <Route path="help-center" element={<HelpCenter />} />
                      <Route path="artisan" element={<Artisan />} />
                      <Route path="artisans/all" element={<AllArtisans />} />
                      <Route path="artisan/details/:id" element={<ArtisanDetails />} />
                      <Route path="candidates" element={<Candidates />} />
                      <Route path="candidates/all" element={<AllCandidate />} />
                      <Route path="candidate/details/:id" element={<CandidateDetails />} />
                      <Route path="candidate/:id/staffs" element={<CandidateStaff />} />
                      <Route path="job-listing" element={<JobListing />} />
                      <Route path="jobs" element={<AllJobs />} />
                      <Route path="job/details/:id" element={<JobDescriptionPage />} />
                      <Route path="guarantors" element={<AllGuarantors />} />
                      <Route path="medical-histories" element={<AllMedicalHistories />} />
                      

                      <Route path="police-reports" element={<AllPoliceReports />} />
                      <Route path="blogs" element={<Blogs/>} />
                      <Route path="create-blog" element={<CreateBlog/>} />

                    </Routes>
                  </PrimeReactProvider>
                </div>
              </div>
            </main>
          </AdminRouteContextProvider>
        </AdminManagementContextProvider>
      ) : (
        <Navigate to={"/"} replace />
      )}
    </>
  );
}

export default useAdminRoute;