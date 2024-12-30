import { Switch } from "@mantine/core";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";

function Trow({ data, featurePost }) {
  const condition = data.feature_post === "0" ? false : true;
  const [loading, setLoading] = useState(false)

  return (
    <tr
      className={`"border-b  odd:bg-gray-100 odd:text-black   hover:bg-green-200 duration-100 text-little`}
    >
      <td className="text-center py-[5px]">
        <div className="capitalize">
          <img
            src={data.main_image || "/placeholder2.png"}
            className="h-[50px] rounded-full max-w-[50px]"
          />
        </div>
      </td>

      <td className="py-5">
        <div className="w-full flex h-full items-center">
          <span>{data.title}</span>
        </div>
      </td>

      <td className="py-5">
        <div className="flex items-center justify-center">
          {new Date(data.created_at).toLocaleDateString()}
        </div>
      </td>

      <td className="">
        <p className=" text-center font-semibold">
          {new Date(data.updated_at).toLocaleDateString()}
        </p>
      </td>

      <td>
        <div className="items-center flex justify-center gap-2 cursor-pointer py-[15px]">
          <Switch
            checked={condition}
            disabled={loading}
            onChange={async (e) => {
              // console.log(e.currentTarget.checked);
              setLoading(true)
              await featurePost(data, e.currentTarget.checked);
              setLoading(false)
            }}
          />
          {loading && <FaSpinner className="animate-spin"/>}
        </div>
      </td>
    </tr>
  );
}

export default Trow;
