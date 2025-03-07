import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function DescriptionItem({ data, jobUtils }) {
  const [content, setContent] = useState(data.placeholder);

  return (
    <div className="flex flex-col md:flex-row border-b py-2 min-h-[170px]">
      <div className="flex flex-col w-full md:max-w-[25%] gap-[10px]">
        <h3 className="text-gray-700 text-sm font-semibold flex gap-1">{data.title} {data?.required && <strong className="text-red-500">*</strong>}</h3>
        {/* <span className="text-little text-gray-600">{data.desc}</span> */}
      </div>

      <div className="flex flex-col gap-[3px] w-full text-gray-600 justify-between">
        <div className="h-[90%]">
          <ReactQuill
            placeholder={data.placeholder}
            value={jobUtils.details[data.name]}
            onChange={(text) => {
              jobUtils.setDetails({ ...jobUtils.details, [data.name]: text });
            }}
          />
        </div>

        <span className="text-[10px] text-gray-500">
          Maximum of 500 characters
        </span>
      </div>
    </div>
  );
}

export default DescriptionItem;
