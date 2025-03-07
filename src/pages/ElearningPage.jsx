import React, { useState, useContext, useEffect } from "react";
import Footer from "../components/Landing/Footer";
import Navbar from "../components/Landing/Navbar";
import LearningHeroSection from "../components/Landing/LearningHeroSection";
import LearningCourseGrid from "../components/Landing/LearningCourseGrid";
import HowItWorks from "../components/Landing/HowItWorks";
import InfoSection from "../components/Landing/InfoSection";
import Testimonial from "../components/Landing/Testimonial";
import { ResourceContext } from "../context/ResourceContext";
import study from "../assets/pngs/study.png";
import { Helmet } from "react-helmet";
const ElearningPage = () => {
    const { setGetAllCourses, getAllCourses } = useContext(ResourceContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [courses, setCourses] = useState([]);

    // Trigger data fetch
    useEffect(() => {
        setLoading(true);
        try {
            setGetAllCourses((prev) => ({
                ...prev,
                isDataNeeded: true,
            }));
        } catch (error) {
            setError("Error loading courses");
            setLoading(false);
        }
    }, [setGetAllCourses]);

    // Handle fetched data
    useEffect(() => {
        if (getAllCourses?.data) {
            setCourses(
  getAllCourses.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
);
            setLoading(false);
        }
    }, [getAllCourses]);

    return (
        <>
            <Helmet>
                <title>Mayrahkee | E-Learning</title>
            </Helmet>
            <LearningHeroSection />
            <div className="relative max-w-[1400px] w-full mx-auto">
                <Navbar register="https://mayrahkeeafrica.vercel.app/registration" login="https://mayrahkeeafrica.vercel.app/login" />
                <main className="relative px-5 h-auto flex flex-col gap-5">
                    <div className="my-2">
                        {loading ? (
                            <div className="flex justify-center items-center mt-10 min-h-40 bg-gray-100">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center mt-10 min-h-40 bg-gray-100">
                                <div className="text-xl font-bold text-red-600">{error}</div>
                            </div>
                        ) : (
                            <LearningCourseGrid list={courses.slice(0, Math.round(courses.length / 2))} />
                        )}
                        <button className="rounded-full my-4 px-4 py-2 bg-black text-white w-60">
                            Show all Courses
                        </button>
                    </div>
                    <div className="my-3">
                        <h2 className="font-semibold text-2xl">Learners are also viewing</h2>
                        {loading ? (
                            <div className="flex justify-center items-center mt-10 min-h-40 bg-gray-100">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center mt-10 min-h-40 bg-gray-100">
                                <div className="text-xl font-bold text-red-600">{error}</div>
                            </div>
                        ) : (
                            <LearningCourseGrid list={courses.slice(Math.round(courses.length / 2))} />
                        )}
                    </div>
                    <Testimonial />
                    <HowItWorks />
                    <InfoSection
                        title="Join our community of ambitious professionals today and unlock the doors to your dream career"
                        description="Our vision is to be recognized as Africa’s foremost recruitment partner and employer of choice. We aim to set new benchmarks for innovation, ethical practices, and leadership in the industry."
                        buttonText="Get Started Now"
                        imageSrc={study}
                        reverse={true}
                    />
                </main>
            </div>
            <Footer />
        </>
    );
};

export default ElearningPage;
