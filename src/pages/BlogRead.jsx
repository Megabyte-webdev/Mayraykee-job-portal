import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';
import SectionHeader from "../components/Landing/SectionHeader";
import { BASE_URL } from '../utils/base';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { resourceUrl } from '../services/axios-client';

const BlogRead = ({general=true}) => {
    const { id } = useParams(); // Get the blog ID from the URL
    const [blog, setBlog] = useState(null); // Store the fetched blog data
    const [loading, setLoading] = useState(false); // Loading state

    // Function to calculate reading time
    const calculateReadingTime = (text) => {
        const wordsPerMinute = 200; // Average reading speed
        const words = text.split(/\s+/).length; // Count words
        return Math.ceil(words / wordsPerMinute); // Round up to the nearest minute
    };

    // Fetch blog details by ID
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${BASE_URL}/blog/posts/${id}`) // Replace with your API URL
            .then((response) => {
                const data = response?.data?.data;
                if (data) {
                    // Add reading time to the blog object
                    const blogWithReadingTime = {
                        ...data,
                        readingTime: calculateReadingTime(data.description || ""),
                    };
                    setBlog(blogWithReadingTime);
                }
                setLoading(false);
            })
            .catch((error) => {
                toast.error("Error fetching blog:", error?.message);
                setLoading(false);
            });
    }, [id]); // Run the effect when `id` changes

    // Render loading spinner or blog details
    if (loading) {
        return (
            <div className="flex justify-center items-center mt-10 h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
            </div>
        );
    }

    if (!blog) {
        return <p className="text-center mt-10">Blog not found.</p>;
    }

    return (
        <>
            <Helmet>
                <title>Mayrahkee | {blog?.title}</title>
            </Helmet>
            <SectionHeader
                title={blog.title}
                subtitle={blog.description.slice(0, 150)}
                img={`${resourceUrl}${blog.main_image}`}
                reads={blog.readingTime}
                time={new Date(blog.created_at).toLocaleDateString()}
            />
            <div className={general ? "relative max-w-[1400px] w-full mx-auto" : "w-full"}>
                <div className={general ? "block":"hidden"}><Navbar /></div>
                <main className="w-full relative mb-20 px-5 h-auto flex flex-col gap-5">
                    <div className="prose max-w-full">
                        <p dangerouslySetInnerHTML={{ __html: blog?.description}} />
                    </div>
                </main>
            </div>
            <div className={general ? "block":"hidden"}><Footer /></div>
        </>
    );
};

export default BlogRead;
