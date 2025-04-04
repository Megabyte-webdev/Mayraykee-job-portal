import { lazy, Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FallBack from "./components/Fallback";
import { ToastContainer } from "react-toastify";
import { AuthContextProvider } from "./context/AuthContex";
import { SubscriptionContextProvider } from "./context/SubscriptionContext";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ApplicationContextProvider } from "./context/ApplicationContext";
import { JobContextProvider } from "./context/JobContext";
import { InterviewContextProvider } from "./context/InterviewContext";
import { ResourceContextProvider } from "./context/ResourceContext";
import { NotificationContextProvider } from "./context/NotificationContext";
import InterviewRoom from "./components/video-sdk/InterviewRoom";
import { SessionContextProvider } from "./context/SessionContext";
import { ChatContextProvider } from "./context/ChatContext";

//Lazy imports of pages
const Login = lazy(() => import("./pages/Login"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminOTP = lazy(() => import("./components/AdminAuth/AdminOTP"));
// const Registration = lazy(() => import("./pages/Registration"));
const RegistrationTwo = lazy(() => import("./pages/RegistrationTwo"));
const NotFound = lazy(() => import("./pages/404"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

//Lazy imports of routes
const RegistrationRoute = lazy(() => import("./routes/useRegistrationRoute"));
const ApplicantRoutes = lazy(() => import("./routes/useApplicantRoute"));
const CompanyRoutes = lazy(() => import("./routes/useCompanyRoute"));
const StaffRoutes = lazy(() => import("./routes/useStaffRoute"));
const AdminRoutes = lazy(() => import("./routes/useAdminRoute"));
const PublicRoutes = lazy(() => import("./routes/PublicRoute"));


const AdminExclusivesRoute = lazy(() => import('./routes/useAdminExclusiveRoute'))

function App() {
  return (
    <>
      <AuthContextProvider>
        <ResourceContextProvider>
          <MantineProvider>
            <SubscriptionContextProvider>
              <ChatContextProvider>
                <ApplicationContextProvider>
                  <JobContextProvider>
                    <InterviewContextProvider>
                      <NotificationContextProvider>
                        <ToastContainer autoClose={2000} draggable />
                        <Suspense fallback={<FallBack />}>
                          <Router>
                            <Routes>
                              <Route path="/login" element={<Login />} />
                              <Route
                                path="/admin/login"
                                element={
                                  <div className="px-2 md:px-5 lg:px-8">
                                    <AdminLogin />
                                  </div>
                                }
                              />


                              <Route
                                path="/super/admin/otp-verification"
                                element={<AdminOTP />}
                              />

                              {/* <Route path="/registration" element={<Registration />} /> */}


                              {/* Dashboard Routes using the dashboard hook */}
                              {/* Other Routes can go here using thier hook e.g adminDashboardRoute */}
                              <Route
                                path="/*"
                                element={<PublicRoutes />}
                              />
                              <Route
                                path="/applicant/*"
                                element={<ApplicantRoutes />}
                              />
                              <Route
                                path="/registration/*"
                                element={<RegistrationRoute />}
                              />
                              <Route
                                path="/company/*"
                                element={<CompanyRoutes />}
                              />
                              <Route
                                path="/staff/*"
                                element={<StaffRoutes />}
                              />
                              <Route
                                path="/admin/*"
                                element={<AdminRoutes />}
                              />

                              <Route
                                path="/admin-exclusives/*"
                                element={<AdminExclusivesRoute />}
                              />

                              <Route
                                path="/interview-room"
                                element={<InterviewRoom />}
                              />
                              <Route
                                path="/forgot-password"
                                element={<ForgotPassword />}
                              />

                            </Routes>
                          </Router>
                        </Suspense>
                      </NotificationContextProvider>
                    </InterviewContextProvider>

                  </JobContextProvider>
                </ApplicationContextProvider>
              </ChatContextProvider>
            </SubscriptionContextProvider>
          </MantineProvider>
        </ResourceContextProvider>

      </AuthContextProvider>
    </>
  );
}

export default App;
