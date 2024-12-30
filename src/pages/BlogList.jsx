import React, { useEffect, useState, useContext, useMemo } from 'react';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { ResourceContext } from "../context/ResourceContext";

const BlogList = () => {
    const {
        setGetAllBlogPosts,
        getAllBlogPosts,
        setGetAllBlogCategories,
        getAllBlogCategories
    } = useContext(ResourceContext);

    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState("All");
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Fetch blog posts and categories
    useEffect(() => {
        setGetAllBlogPosts((prev) => ({
            ...prev,
            isDataNeeded: true,
        }));
        setGetAllBlogCategories((prev) => ({
            ...prev,
            isDataNeeded: true,
        }));
    }, []);


const calculateReadingTime = (text) => {
    const wordsPerMinute = 200; // Average reading speed
    const words = text.split(/\s+/).length; // Count words
    const minutes = Math.ceil(words / wordsPerMinute); // Round up
    return minutes;
};

  useEffect(() => {
    if (getAllBlogPosts?.data) {
        const fetchedBlogs = getAllBlogPosts.data.data;

        // Add reading time to each blog
        const blogsWithReadingTime = fetchedBlogs.map((blog) => ({
            ...blog,
            readingTime: calculateReadingTime(blog.description || ""),
        }));

        

        // Set the most recent post
        const sortedBlogs = blogsWithReadingTime.slice().sort(
            (a, b) => new Date(b.time_posted) - new Date(a.time_posted)
        );
        setBlogs(sortedBlogs);
    }
}, [getAllBlogPosts]);


    // Process fetched categories
    useEffect(() => {
        if (getAllBlogCategories?.data) {
            const fetchedCategories = getAllBlogCategories.data.data || [];
            setCategories(fetchedCategories);
            setIsLoading(false);
            console.log(categories)
        }
    }, [getAllBlogCategories]);

    // Handle subcategory selection
    const handleSubcategorySelect = (subcategoryId, categoryId) => {
        setSelectedSubcategory(subcategoryId);  // Set selected subcategory
        setSelected(categoryId);  // Set the category associated with the subcategory
        console.log(categoryId, subcategoryId)
    };

    // Filter blogs based on selected category, subcategory, and search query
    const filteredBlogs = useMemo(() => {
        let result = blogs;
        
        // Filter by category
        if (selected !== "All") {
            result = result.filter((blog) => blog.blog_category_id === selected);
        }

        // Filter by subcategory
        if (selectedSubcategory !== null) {
            result = result.filter(
                (blog) => blog.blog_sub_category_id === selectedSubcategory
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            result = result.filter(
                (blog) =>
                    blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    blog.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        console.log(result)
        return result;
        
    }, [selected, selectedSubcategory, searchQuery, blogs]);

    return (
        <>
            <div className="relative max-w-[1400px] w-full mx-auto">
                <Navbar />
                <main className="relative my-24 px-5 h-auto flex flex-col gap-5">
                    {/* Search and Categories */}
                    <div className="flex flex-col md:flex-row md:gap-x-10 mt-3 md:items-end md:overflow-x-auto">
                        {/* Search Input */}
                        <div className="relative w-full md:w-60">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-10 py-2 rounded-full h-10 border border-gray-500 text-sm"
                                placeholder="Search blogs"
                            />
                            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                        </div>
                        {/* Categories */}
                        <div className="flex md:gap-3 mt-6 border-b-[1px] border-b-gray-400 overflow-x-auto">
                            <button
                                onClick={() => {
                                    setSelected("All");
                                    setSelectedSubcategory(null);
                                }}
                                className={`capitalize text-sm px-4 py-2 ${selected === "All"
                                    ? "text-green-600 border-b-[2px] border-b-green-600"
                                    : "text-gray-700"
                                    } font-bold`}
                            >
                                All
                            </button>
                            {categories?.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setSelected(category.id);
                                        setSelectedSubcategory(null); // Reset subcategory when changing category
                                    }}
                                    className={`capitalize text-sm px-4 py-2 ${selected === category.id
                                        ? "text-green-600 border-b-[2px] border-b-green-600"
                                        : "text-gray-700"
                                        } font-bold`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 my-6 overflow-x-auto w-full md:w-[80%] md:ml-auto">
    {(
        selected === "All"
            ? categories.flatMap((category) =>
                category.subcategories?.map((subcategory) => ({
                    ...subcategory,
                    categoryId: category.id, // Attach the category ID to each subcategory
                }))
            )
            : categories
                .filter((category) => category.id === selected)
                .flatMap((category) => category.subcategories || [])
    )
        .reverse() // Reverse the array to achieve reverse order
        .map((subcategory) => (
            <button
                key={subcategory?.id}
                onClick={() =>
                    handleSubcategorySelect(subcategory?.id, subcategory.blog_category_id)
                }
                className={`capitalize border-[2px] rounded-full border-gray-500 text-sm px-4 py-1 whitespace-nowrap ${selectedSubcategory === subcategory?.id
                    ? "text-green-600 border-green-600"
                    : "text-gray-700"
                    } font-bold`}
            >
                {subcategory.name}
            </button>
        ))}
</div>

                    {/* Blog Posts */}
                    {isLoading ? (
                        <div className="flex justify-center items-center mt-10">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
                        </div>
                    ) : filteredBlogs?.reverse()?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
                            {filteredBlogs.map((blog) => (
                                <article
                                    onClick={() => {
                                        scrollTo(0, 0);
                                        navigate(`/blogs/${blog.id}`);
                                    }}
                                    key={blog.id}
                                    className="cursor-pointer bg-white rounded-lg shadow overflow-hidden"
                                >
                                    <img
                                        src={blog?.main_image || "https://via.placeholder.com/150/000000/FFFFFF?text=Image+Not+Found"}
                                        alt={blog.title || "Default Title"}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-2 flex-1 w-[90%] md:w-full flex flex-col justify-center">
                                        <small className="mt-2 text-gray-400 flex items-center">
                                            <span className="mr-2 w-2 h-2 rounded-full bg-gray-400"></span>
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </small>
                                        <h4 className="font-bold text-xl md:my-2 lg:my-3">
                                            {blog.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-1 md:mb-3">
                                            {blog.description?.slice(0, 100)}...
                                        </p>
                                        <article className="flex items-center justify-between gap-1 md:gap-3">
                                            <small className="mt-2 text-gray-400 flex items-center">
                                                <span className="mr-2 w-2 h-2 rounded-full bg-gray-400"></span>
                                                {blog?.readingTime} min read
                                            </small>
                                            <p className="text-green-600 text-xs font-medium">
                                                Read More {">>"}
                                            </p>
                                        </article>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center mt-10">No blogs found.</p>
                    )}
                </main>
            </div>
            <Footer />
        </>
    );
};

export default BlogList;
