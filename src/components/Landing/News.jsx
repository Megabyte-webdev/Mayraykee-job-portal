import React, { useState, useEffect, useContext } from 'react';
import { ResourceContext } from "../../context/ResourceContext";
import { useNavigate } from 'react-router-dom';
import { resourceUrl } from "../../services/axios-client.ts";

const News = () => {
    const navigate = useNavigate();
    const [recent, setRecent] = useState(null);
    const [news, setNews] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const { setGetAllBlogPosts, getAllBlogPosts } = useContext(ResourceContext);

    // Fetch blog posts
    useEffect(() => {
        setGetAllBlogPosts((prev) => ({
            ...prev,
            isDataNeeded: true,
        }));
    }, []);
    const calculateReadingTime = (text) => {
        const wordsPerMinute = 200;
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };


    useEffect(() => {
        if (getAllBlogPosts?.data) {
            const fetchedBlogs = getAllBlogPosts?.data?.data?.filter((one) => one?.feature_post === "1") //  featured posts
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by latest
                .slice(0, 4); // Get only the latest 5

            // Add reading time to each blog
            const blogsWithReadingTime = fetchedBlogs.map((blog) => ({
                ...blog,
                readingTime: calculateReadingTime(blog?.description || ""),
            }));

            setBlogs(blogsWithReadingTime);
            // Set the most recent post
            const sortedBlogs = blogsWithReadingTime
            setRecent(sortedBlogs?.[0] || null);

            // Set other recent news
            setNews(sortedBlogs?.slice(1) || []);
        }
    }, [getAllBlogPosts]);


    return (
        <div className="bg-[#47aa4910]">
            <div className="flex justify-between items-center p-3">
                <h2 className="text-sm font-semibold">LATEST BLOGS</h2>
                <button
                    className="text-green-600 border-[1px] border-green-600 px-6 py-1 rounded-full font-bold text-sm"
                    onClick={() => {
                        scrollTo(0, 0);
                        navigate('/blogs');
                    }}
                >
                    Read All
                </button>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-4 h-auto min-h-[550px] items-stretch">
                {/* Recent view */}
                {recent && (
                    <section
                        key={recent?.id}
                        className="w-full h-max md:w-1/2 flex-1 flex flex-col p-4"
                    >
                        <img
                            className="w-full h-[250px] md:h-[350px] object-cover rounded-md"
                            src={recent?.main_image ? `${resourceUrl}${recent?.main_image}` : "https://via.placeholder.com/150"}
                            alt="Recent News"
                        />
                        <div className="p-2 ">
                            <small className="mt-2 text-gray-400 flex items-center">
                                <span className="mr-2 w-2 h-2 rounded-full bg-gray-400"></span>
                                {new Date(recent?.created_at).toLocaleDateString()}
                            </small>
                            <h4 className="font-bold text-lg md:text-xl my-3">
                                {recent?.title}
                            </h4>
                            <p className="text-sm text-gray-500 mb-3" dangerouslySetInnerHTML={{ __html: `${recent?.description?.slice(0, 300)}...` }}></p>
                            <article className="mt-2 flex justify-between gap-3">
                                <small className="mt-2 text-sm text-gray-400 flex items-center">
                                    <span className="mr-2 w-2 h-2 rounded-full bg-gray-400"></span>
                                    {recent?.readingTime} min read.
                                </small>
                                <p
                                    className="text-green-600 text-sm font-medium cursor-pointer"
                                    onClick={() => {
                                        scrollTo(0, 0);
                                        navigate(`/blogs/${recent?.id}`);
                                    }}
                                >
                                    Read More {">>"}
                                </p>
                            </article>
                        </div>
                    </section>
                )}

                {/* Other recent news */}
                <div className="w-full md:w-1/2 flex flex-col gap-3 overflow-y-auto max-h-[550px]">
                    {news.map((newsItem) => (
                        <section
                            key={newsItem?.id}
                            onClick={() => {
                                scrollTo(0, 0);
                                navigate(`/blogs/${newsItem?.id}`);
                            }}
                            className="flex justify-between items-stretch cursor-pointer"
                        >
                            <div className="w-28 h-28 md:w-32 md:h-auto md:max-h-[180px] lg:w-40 lg:h-auto flex-shrink-0">
                                <img
                                    className="w-full h-full object-cover rounded-md"
                                    src={newsItem?.main_image ? `${resourceUrl}${newsItem?.main_image}` : "https://via.placeholder.com/150"}
                                    alt="News"
                                />
                            </div>

                            <div className="p-2 flex-1 w-[90%] md:w-full flex flex-col justify-center">
                                <small className="mt-2 text-gray-400 flex items-center">
                                    <span className="mr-2 w-2 h-2 rounded-full bg-gray-400"></span>
                                    {new Date(newsItem?.created_at).toLocaleDateString()}
                                </small>
                                <h4 className="font-bold text-sm md:my-2 lg:my-3">
                                    {newsItem?.title}
                                </h4>
                                <p className="text-sm text-gray-500 mb-1 md:mb-3" dangerouslySetInnerHTML={{ __html: `${newsItem?.description?.slice(0, 60)}...` }}>
                                </p>
                                <article className="flex items-center justify-between gap-1 md:gap-3">
                                    <small className="text-xs mt-2 text-gray-400 flex items-center">
                                        <span className="mr-2 w-2 h-2 rounded-full bg-gray-400"></span>
                                        {newsItem?.readingTime} min read.
                                    </small>
                                    <p className="text-green-600 text-xs font-medium">
                                        Read More {">>"}
                                    </p>
                                </article>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default News;
