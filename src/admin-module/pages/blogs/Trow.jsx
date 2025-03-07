import { Switch } from "@mantine/core";
import { useState, useContext } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { axiosClient, resourceUrl } from "../../../services/axios-client";
import { AuthContext } from "../../../context/AuthContex";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { onFailure } from "../../../utils/notifications/OnFailure";

function Trow({ data, featurePost, refresh }) {
  const { authDetails } = useContext(AuthContext);
  const condition = data.feature_post === "0" ? false : true;
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const client = axiosClient(authDetails?.token, true);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await client.delete(`/blog/posts/${data.id}`);
      refresh();
        onSuccess({message:"Delete Post", success:"Post deleted successfully!"});
    } catch (error) {
      onFailure({message:"Delete Post", error:error?.response?.data?.message || "Failed to delete the post."});
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr className={`"border-b odd:bg-gray-100 odd:text-black hover:bg-green-200 duration-100 text-little`}>
      <td className="text-center py-[5px]">
        <div className="capitalize">
          <img
            src={data.main_image ? `${resourceUrl}${data.main_image}` : "/placeholder2.png"}
            className="h-[50px] rounded-full max-w-[50px] object-cover"
            alt="Post Thumbnail"
          />
        </div>
      </td>

      <td className="py-5">
        <div className="w-32 flex h-full items-center *:truncate">
          <span>{data.title}</span>
        </div>
      </td>

      <td className="py-5">
        <div className="flex items-center justify-center">
          {new Date(data.created_at).toLocaleDateString()}
        </div>
      </td>

      <td className="">
        <p className="text-center font-semibold">
          {new Date(data.updated_at).toLocaleDateString()}
        </p>
      </td>

      <td>
        <div className="items-center flex justify-center gap-2 cursor-pointer py-[15px]">
          <Switch
            checked={condition}
            disabled={loading || deleting}
            onChange={async (e) => {
              console.log(e.currentTarget.checked);
              setLoading(true)
              await featurePost(data, e.currentTarget.checked);
              setLoading(false)
            }}
          />
          {loading && <FaSpinner className="animate-spin" />}
        </div>
      </td>

      <td>
        <div className="flex justify-center items-center gap-2 px-2">
        <span
            onClick={() => navigate(`/blogs/${data?.id}`)}
            className="cursor-pointer font-medium text-sm p-1 underline text-black rounded-md"
          >
            View
          </span>
          <span
            onClick={() => navigate("/admin/create-blog", { state: { data } })}
            className="cursor-pointer font-medium text-sm p-1 underline text-black rounded-md"
          >
            Edit
          </span>
          <span
            onClick={handleDelete}
            className={`cursor-pointer font-medium text-sm p-1 underline text-black rounded-md ${deleting ? "opacity-50 pointer-events-none" : ""}`}
          >
            {deleting ? <FaSpinner className="animate-spin inline-block" /> : "Delete"}
          </span>
        </div>
      </td>
    </tr>
  );
}

export default Trow;
