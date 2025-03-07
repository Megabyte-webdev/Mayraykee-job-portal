import React, { useEffect, useState, useContext } from "react";
import Header from "./Header";
import UploadSlider from "./UploadSlider";
import PageAttributes from "./PageAttributes";
import TextEditor from "./TextEditor";
import SectionHeader from "../../../components/Landing/SectionHeader";
import { axiosClient, resourceUrl } from "../../../services/axios-client";
import { AuthContext } from "../../../context/AuthContex";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { IMAGE_URL } from "../../../utils/base";
import { toast } from "react-toastify";


const CreateBlog = () => {
  const { authDetails } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false); // Loader state
  const [showPreview, setShowPreview] = useState(false); // Toggle preview
  const client = axiosClient(authDetails?.token, true);
  const [editBlog, setEditBlog] = useState(false);
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    blog_category_id: null,
    blog_sub_category_id: null,
    main_image: "",
    secondary_image: null,
    feature_post: 0,
  });
  const [image, setImage] = useState("https://via.placeholder.com/800x400");

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    setBlog((prev) => ({
      ...prev,
      readingTime: calculateReadingTime(blog.description || ""),
    }));
  }, [blog.description]);

  useEffect(() => {
    if (location.state?.data) {
      setBlog(location.state?.data);
      setEditBlog(true);
    }
  }, [location.state]);

  useEffect(() => {
    setImage(
      (typeof blog?.main_image === 'string' && blog?.main_image !== "")
         ? `${resourceUrl}/${blog?.main_image}`
        : blog?.main_image ? image :"https://via.placeholder.com/800x400"
    );
    console.log(image, blog)
  }, [blog]);

  const handlePost = async () => {
    setLoading(true);
  
    try {
      // Define required fields and their user-friendly names
      const requiredFields = [
        { key: "title", label: "Blog Title" },
        { key: "blog_category_id", label: "Blog Category" },
        { key: "blog_sub_category_id", label: "Blog Subcategory" },
        { key: "description", label: "Blog Content" },
        { key: "main_image", label: "Blog Image" }
      ];
  
      // Find missing fields
      const missingFields = requiredFields?.filter(
        (field) => !blog[field.key] || blog[field.key] === ""
      );
  
      if (missingFields.length > 0) {
        const missingFieldLabels = missingFields.map((field) => field.label).join(", ");
        onFailure({
          message: "Incomplete Information",
          error: `Please ensure you provide the following details ${missingFieldLabels}.`,
        });
        setLoading(false);
        console.log(missingFieldLabels);
        return;
      }
  
      let apiFunc;
  
      if (editBlog) {
        const filteredBlog = Object.keys(blog).reduce((acc, key) => {
          if (
            ![
              "created_at",
              "updated_at",
              "feature_post",
              "readingTime",
              "secondary_image"
            ].includes(key)
          ) {
            // Exclude `main_image` if it is a string (indicating an existing image)
            if (!(key === "main_image" && !(blog[key] instanceof File))) {
              acc[key] = blog[key];
            }
          }
          return acc;
        }, {});
  
        const formData = new FormData();
        Object.keys(filteredBlog).forEach((key) => {
          if (key !== "readingTime") {
            formData.append(key, filteredBlog[key]);
          }
        });
  
        apiFunc = client.post(`/blog/posts`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const formData = new FormData();
        
        Object.keys(blog).forEach((key) => {
          if (key !== "readingTime" && !(key === "main_image" && !(blog[key] instanceof File)) && !(key === "secondary_image" && !(blog[key] instanceof File))) {
            formData.append(key, blog[key]);
          }
        });
  
        apiFunc = client.post(`/blog/posts`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      await apiFunc;
      onSuccess({
        message: editBlog ? "Blog Update" : "New Blog",
        success: editBlog ? "Blog Updated Successfully" : "Blog Posted Successfully",
      });
      navigate("/admin/blogs");
    } catch (error) {
      console.log(error);
      onFailure({
        message: editBlog ? "Edit Post Error" : "Post Error",
        error: `An error occurred while ${editBlog ? "updating" : "posting"} the blog.`,
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size exceeds the file size limit of 1MB.");
        event.target.value = null
        return
      }
      setBlog((prevDetails) => ({
        ...prevDetails,
        main_image: file,
      }));
      const savedPhoto = URL.createObjectURL(file)
        setImage(savedPhoto);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex flex-col py-3">
      {showPreview ? (
        <>
          <div className="flex justify-around items-center gap-2 bg-white sticky top-0 py-3 w-full">
            <button
              onClick={() => setShowPreview(false)}
              className="min-w-32 bg-gray-600 text-white p-2 rounded hover:bg-gray-800"
            >
              Continue Editing
            </button>
            <button
              onClick={handlePost}
              className={`min-w-32 font-semibold text-sm p-2 text-white rounded-md flex items-center justify-center ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-800"
                }`}
              disabled={loading}
            >
              {editBlog ? "Republish" : "Publish"} {loading && <FaSpinner className="animate-spin ml-2" />}
            </button>
          </div>
          <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg">
            <SectionHeader
              title={blog.title || "Blog Heading"}
              subtitle={blog?.description?.slice(0, 150) || "Subtitle"}
              img={image}
              reads={blog.readingTime}
              time={new Date().toLocaleDateString()}
            />
            <div className="prose max-w-none leading-8 text-sm p-2">
              <div dangerouslySetInnerHTML={{ __html: blog?.description || "Blog content" }} />
            </div>


          </div>
        </>
      ) : (
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg  py-3">
          <Header />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <div className="lg:col-span-2">
              <UploadSlider image={image} handleImageChange={handleImageChange} />
            </div>
            <PageAttributes setBlog={setBlog} blog={blog} />
          </div>
          <TextEditor setBlog={setBlog} blog={blog} />
          <div className="flex justify-around items-center mt-10 sticky bottom-0 bg-white py-2">
            <button
              onClick={() => { setShowPreview(true); }}
              className="min-w-32 bg-gray-200 font-semibold text-sm p-2 rounded hover:bg-gray-600 hover:text-white"
            >
              Preview
            </button>
            <button
              onClick={handlePost}
              className={`min-w-32 ml-2 font-semibold text-sm p-2 text-white rounded-md flex items-center justify-center ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-800"
                }`}
              disabled={loading}
            >
              {editBlog ? "Edit Blog" : "Publish"} {loading && <FaSpinner className="animate-spin ml-2" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
