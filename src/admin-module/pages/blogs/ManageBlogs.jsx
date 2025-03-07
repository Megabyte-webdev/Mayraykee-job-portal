import { useContext, useEffect, useState } from "react";
import TableWrap from "../../../admin-exclusive-module/components/TableWrap";
import Trow from "./Trow";
import { AuthContext } from "../../../context/AuthContex";
import { axiosClient } from "../../../services/axios-client";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const columns = [" ", "Title", "Date Created", "Date Updated", "Feature", "Actions"];

function ManageBlogs() {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails.user.token);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  const getAllBlogs = async () => {
    setIsLoading(true); // Set loading to true when fetching data
    setError(null); // Reset error state before fetching
    try {
      const { data } = await client.get("/blog/posts");
      if (data.data.data) {
        setBlogs([...data.data.data]);
      }
    } catch (error) {
      setBlogs([]);
      setError("Failed to load blogs. Please try again later."); // Set error message
    } finally {
      setIsLoading(false); // Set loading to false once data is fetched
    }
  };

  const featurePost = async (post, checked) => {
    const val = checked ? "1" : "0";
  
    try {
      // Define fields to exclude
      const excludedFields = ["main_image", "secondary_image"];
  
      // Filter the `post` object to exclude image fields
      const filteredPost = Object.keys(post).reduce((acc, key) => {
        if (!excludedFields.includes(key)) {
          acc[key] = post[key];
        }
        return acc;
      }, {});
  
      // Send the filtered post data to the API
      const { data } = await client.post(`/blog/posts`, { ...filteredPost, feature_post: val });
  
      if (data.data) {
        // await getAllBlogs(); // Uncomment if necessary to refresh blog list
        onSuccess({
          message: "Blog Update Status",
          success: "Updated successfully",
        });
         // Update the blogs state by replacing the matching blog
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === data.data.id ? { ...blog, ...data.data } : blog
        )
      );
        console.log(data.data); // Log the filtered post object for debugging
        return true;
      }
    } catch (error) {
      onFailure({
        message: "Blog Update Error",
        error: "Failed to update",
      });
      return false;
    }
  };
  
  useEffect(() => {
    getAllBlogs();
  }, []);

  return (
    <div className="py-5 w-full h-full flex flex-col gap-10">
      <div className="w-full bg-green-500 text-white p-4 max-h-[100px] flex justify-between items-center">
        <span className="font-semibold text-lg">Manage Blog Posts</span>
        <span onClick={() => navigate("/admin/create-blog")} className="cursor-pointer font-semibold text-sm p-2 bg-white text-black rounded-md">Create Blog</span>
      </div>

      <div className="w-full overflow-x-auto">
        {isLoading ? (
          <div className="w-full h-32 flex justify-center items-center font-bold text-xl">
            <FaSpinner className="animate-spin text-green-500" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : error ? (
          <div className="w-full h-32 flex justify-center items-center text-red-500 font-bold">
            {error} {/* Display error message */}
          </div>
        ) : (
          <TableWrap rows={columns}>
            {blogs.length !== 0 ? (
              blogs.map((current) => <Trow featurePost={featurePost} data={current} key={current.id} refresh={getAllBlogs} />)
            ) : (
              <span className="text-center w-full flex items-center justify-center">
                No Blogs found
              </span>
            )}
          </TableWrap>
        )}
      </div>
    </div>
  );
}

export default ManageBlogs;
