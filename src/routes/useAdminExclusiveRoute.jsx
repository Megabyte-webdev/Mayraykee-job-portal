import { lazy, useContext, useEffect, useReducer, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  adminExclusiveOptions,
  adminExclusiveUtil,
  adminOptions,
  adminnUtilOptions,
} from "../utils/constants";
import { AuthContext } from "../context/AuthContex";
import { clear } from "idb-keyval";
import AdminSideBar from "../admin-module/components/AdminSideBar";
import AdminSideBarItem from "../admin-module/components/AdminSideBarItem";
import AdminReducer from "../reducers/AdminReducer";
import AdminExclusiveReducer from "../reducers/AdminExclusiveReducer";
import { AdminExclusiveManagementContextProvider } from "../context/AdminExclusiveManagement";

// Util Component
const NavBar = lazy(() => import("../admin-module/components/NavBar"));
const SideBar = lazy(() => import("../admin-module/components/SideBar"));
const SideBarItem = lazy(() =>
  import("../admin-module/components/SideBarItem")
);

const Dashboard = lazy(() =>
  import("../admin-exclusive-module/pages/dashboard/Dashboard")
);
const Exclusives = lazy(() =>
  import("../admin-exclusive-module/pages/exclusives/Exclusives")
);
const SingleExclusive = lazy(() =>
  import("../admin-exclusive-module/pages/exclusives/SingleExclusive")
);
const JobType = lazy(() =>
  import("../admin-exclusive-module/pages/jobs/ViewJob")
);
const ViewApplicant = lazy(() =>
  import("../admin-exclusive-module/pages/applicant/ViewApplicant")
);

const ViewProfile = lazy(() =>
  import("../admin-exclusive-module/pages/profile/ViewProfile")
);

function useAdminRoute() {
  const path = useLocation().pathname;
  // const [state, dispatch] = useReducer(AdminReducer, adminOptions.find((option) => option.route === path));
  const [state, dispatch] = useReducer(
    AdminExclusiveReducer,
    adminExclusiveOptions[0]
  );
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

  const hideNavBarRoutes = ["/admin-exclusives/", "/admin-exclusives/list"];

  const shouldHideNavBar = hideNavBarRoutes.includes(location.pathname);

  return (
    <>
      <AdminExclusiveManagementContextProvider>
        <main className="h-screen w-screen relative flex">
          {/* Conditionally render the sidebar */}
          {!shouldHideNavBar && (
            <AdminSideBar
              authDetails={authDetails}
              toogleIsOpen={toogleIsOpen}
              isMenuOpen={isOpen}
            >
              <ul className="flex flex-col gap-[10px]">
                {adminExclusiveOptions.map((currentOption) => (
                  <AdminSideBarItem
                    key={currentOption.type}
                    data={currentOption}
                    dispatch={dispatch}
                    state={state}
                  />
                ))}
              </ul>

              <ul className="flex flex-col gap-[10px]">
                {adminExclusiveUtil.map((currentOption) => (
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
          <div
            className={`relative flex divide-y-2 divide-secondaryColor bg-white flex-col h-full ${
              !shouldHideNavBar ? "md:w-[82%] w-full" : "w-full"
            }`}
          >
            {!shouldHideNavBar && (
              <NavBar
                state={state}
                toogleIsOpen={toogleIsOpen}
                isMenuOpen={isOpen}
              />
            )}
            <div className="w-full h-[92%] overflow-y-auto">
              <Routes>
                <Route index element={<Dashboard />} />

                <Route path="lists/*">
                  <Route index element={<Exclusives />} />
                  <Route path=":id" element={<SingleExclusive />} />
                </Route>

                <Route path="job/:id" element={<JobType />} />
                <Route path="applicant/:id" element={<ViewApplicant />} />
                <Route path="profile" element={<ViewProfile />} />
              </Routes>
            </div>
          </div>
        </main>
      </AdminExclusiveManagementContextProvider>
    </>
  );
}

export default useAdminRoute;
