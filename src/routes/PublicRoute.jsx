import { lazy, Suspense, useContext, useEffect, useReducer, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import FallBack from "../components/Fallback";
import { ResourceContextProvider } from "../context/ResourceContext";
const NotFound = lazy(() => import("../pages/404"));

const LandingPage = lazy(() => import("../pages/LandingPage"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const Help = lazy(() => import("../pages/Help"));
const ContactForm = lazy(() => import("../pages/ContactForm"));
const FAQ = lazy(() => import("../pages/FAQ"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("../pages/TermsConditions"));
const ElearningPage = lazy(() => import("../pages/ElearningPage"));
const BlogList = lazy(() => import("../pages/BlogList"));
const BlogRead = lazy(() => import("../pages/BlogRead"));
const JobSearchPage = lazy(() => import("../pages/JobSearchPage"));
const FindStaff = lazy(() => import("../pages/FindStaff"));

function PublicRoute() {

  return (
    <ResourceContextProvider>
      <Suspense fallback={<FallBack />}>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/learning"
            element={<ElearningPage />}
          />
          <Route path="/help" element={<Help />} />
          <Route
            path="/contact"
            element={<ContactForm />}
          />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/find-jobs" element={<JobSearchPage />} />
          <Route path="/find-staff/:id" element={<FindStaff />} />

          <Route
            path="/terms&conditions"
            element={<TermsConditions />}
          />
          <Route
            path="/privacypolicy"
            element={<PrivacyPolicy />}
          />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:id" element={<BlogRead />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

    </ResourceContextProvider>

  );
}

export default PublicRoute;
