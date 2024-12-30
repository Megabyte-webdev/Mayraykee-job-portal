import { useContext, useEffect, useState } from "react";
import TableWrap from "../../../admin-exclusive-module/components/TableWrap";
import Trow from "./Trow";
import { AuthContext } from "../../../context/AuthContex";
import { axiosClient } from "../../../services/axios-client";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { onSuccess } from "../../../utils/notifications/OnSuccess";

const columns = [" ", "Title", "Date Created", "Date Updated", "Feature"];

function ManageBlogs() {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails.user.token);
  const [blogs, setBlogs] = useState([]);

  const getAllBlogs = async () => {
    try {
      const { data } = await client.get("/blog/posts");
      if (data.data.data) {
        setBlogs([...data.data.data]);
      }
    } catch (error) {
      setBlogs([]);
    }
  };

  const featurePost = async (post, checked) => {
   console.log(post)
    const val = checked ? '1' : '0';

    try {
      const { data } = await client.put(`/blog/posts/${ post.id}`, {feature_post: val});
      if (data.data) {
        await getAllBlogs()
        onSuccess({
          message: 'Blog Update Status',
          success: 'Updated successfully'
        })
        return true;
      }
    } catch (error) {
      onFailure({
        message: 'Blog Update Error',
        error: 'Failed to update'
      })
      return false;
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  return (
    <div className="px-10 py-5 w-full h-full flex flex-col gap-10">
      <div className="w-full bg-green-500 text-white p-4 max-h-[100px]">
        <span className="font-semibold text-lg">Mange Blog Posts</span>
        <span></span>
      </div>

      <div className="w-full overflow-auto">
      <TableWrap rows={columns}>
        {blogs.length !== 0 ? (
          blogs.map((current) => <Trow featurePost={featurePost} data={current} key={current.id} />)
        ) : (
          <span className="text-center w-full flex items-center justify-center">
            No Blogs found
          </span>
        )}
      </TableWrap>
      </div>
    </div>
  );
}

export default ManageBlogs;
