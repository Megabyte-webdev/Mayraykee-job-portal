import React, { useContext } from "react";
import Hero from "../components/Landing/Hero";
import Navbar from "../components/Landing/Navbar";
import Experience from "../components/Landing/Experience";
import Banner from "../components/Landing/Banner";
import UserCategory from "../components/Landing/UserCategory";
import JobBanner from "../components/Landing/JobBanner";
import Jobs from "../components/Landing/Jobs";
import News from "../components/Landing/News";
import Advert from "../components/Landing/Advert";
import Footer from "../components/Landing/Footer";
import { redirect, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import { Helmet } from "react-helmet";
const RecruitmentPage = () => {
  const { authDetails } = useContext(AuthContext);
  // window.scrollTo(0, 0);

  const redirectPath = () => {
    switch (authDetails?.user?.role) {
      case "candidate":
        return "/applicant";
      case "employer":
        return "/company";
      case "staff":
        return "/staff";
      case "admin":
        return "/admin"
      default :
        return "/"

    }
  };

  return authDetails?.user?.role ? (
    <Navigate to={redirectPath()} />
  ) : (
    <>
      <Helmet>
        <title>Mayrahkee | Recruitment Page</title>
      </Helmet>
      <div className="relative max-w-[1400px] w-full mx-auto">
        <Navbar />
        <main className="relative my-20 px-5 h-full">
          <Hero />
          <Experience />
          <Banner
            title="Choose Your Path"
            desc="Choose the path that aligns with your goals and unlock new opportunities for growth"
          />
          <UserCategory />
          <JobBanner />
          <Jobs />
          <Banner
            title="insights and updates"
            desc="Stay informed with experts articles, industry news and tips to help you grow personally and professionally"
          />
          <News />
          <Advert />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default RecruitmentPage;
