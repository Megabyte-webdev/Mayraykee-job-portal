import { lazy, useContext, useEffect, useReducer, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { staffOptions, staffUtilOptions } from "../utils/constants";
import { AuthContext } from "../context/AuthContex";
import { clear } from "idb-keyval";
import useCompanyProfile from "../hooks/useCompanyProfile";
import StaffReducer from "../reducers/StaffReducer";
import { StaffRouteContextProvider } from "../context/StaffRouteContext";
import { StaffManagementContextProvider } from "../context/StaffManagementModule";
import StaffCard from "../components/staffs/StaffCard";
import withApplicationStatus from "../hocs/withApplicationStatus";

//Util Component
const NavBar = lazy(() => import("../staff-module/components/NavBar"));
const SideBar = lazy(() => import("../staff-module/components/SideBar"));
const SideBarItem = lazy(() =>
  import("../staff-module/components//SideBarItem")
);
//pages
const Dashboard = lazy(() => import("../staff-module/pages/dashboard/Dashboard"));
const Home = lazy(() => import("../staff-module/pages/home/Home"));
const Verifications = lazy(() =>
  import("../staff-module/pages/verifications/Verifications")
);
const Resume = lazy(() =>
  import("../staff-module/pages/resume/Resume")
);
const HelpCenter = lazy(() => import("../pages/HelpCenter"));
const Settings = lazy(() => import("../company-module/pages/settings/Settings"));
const BlogList = lazy(() => import("../pages/BlogList"));
const BlogRead = lazy(() => import("../pages/BlogRead"));

function useStaffRoute() {
  const [state, dispatch] = useReducer(StaffReducer, staffOptions[0]);
  const { authDetails } = useContext(AuthContext);
  const [redirectState, setRedirectState] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const toogleIsOpen = () => setIsOpen(!isOpen);
  const { pathname }=useLocation();
  const options=[...staffOptions, ...staffUtilOptions]
  useEffect(() => {
    const matchedOption = options.find((opt) => pathname===opt?.route);
    if (matchedOption) {
      dispatch(matchedOption);
    }else{
dispatch(options[0]);
    }
  }, [pathname]);
  
  const setSideBar = (index) => {
    const page = staffOptions[index];
    dispatch({ ...page });
  };

  useEffect(() => {
    const clearDb = async () => await clear();

    const handleUnload = () => {
      clearDb();
    };

    window.addEventListener("unload", handleUnload);

    return () => () => {
      handleUnload();
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  return (
    <>
      {authDetails?.token ? (
        <StaffManagementContextProvider>
          <StaffRouteContextProvider setSideBar={setSideBar}>
            <main className="h-screen w-screen relative flex">
              {/* Side bar takes up 20% of total width and 100% of height */}

              <SideBar
                authDetails={authDetails}
                toogleIsOpen={toogleIsOpen}
                isMenuOpen={isOpen}
              >
                <ul className="flex flex-col gap-[10px]">
                  {staffOptions.map((currentOption) => (
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
                  {staffUtilOptions.map((currentOption) => (
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
              <div className="md:w-[82%] w-full relative flex divide-y-2 divide-secondaryColor bg-white flex-col h-full">
                <NavBar
                  state={state}
                  toogleIsOpen={toogleIsOpen}
                  isMenuOpen={isOpen}
                />
                <div className="w-full  h-[92%] overflow-y-auto">
                  <Routes>
                    <Route index element={<Dashboard />} />
                    {/* <Route path="*" element={<NotFound />} /> */}
                    <Route path="profile" element={<Home />} />
                    <Route path="verifications" element={withApplicationStatus(Verifications)} />
                    <Route path="resume" element={withApplicationStatus(Resume)} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help-center" element={<HelpCenter />} />
                                    <Route path="/blogs" element={<BlogList general={false} direct="/staff/" />} />
                <Route path="/blogs/:id" element={<BlogRead general={false} />} />
                  </Routes>
                </div>
              </div>
            </main>
          </StaffRouteContextProvider>
        </StaffManagementContextProvider>
      ) : (
        <Navigate to={"/"} replace />
      )}
    </>
  );
}

export default useStaffRoute;
