function BasicJobInput({ data, jobUtils }) {
  return (
    <div className="flex gap-[30px] border-b py-2 text-little ">
      <div className="flex flex-col min-w-[25%] gap-[10px]">
        <h3 className="text-gray-700 text-sm font-semibold">{data.label}</h3>
        <span className="text-little text-gray-400">
          {data.prompt}
        </span>
      </div>

      <div className="flex flex-col gap-[3px] ">
        <input
          value={jobUtils.details[data.name]}
          onChange={jobUtils.onTextChange}
          name={data.name}
          type={data.type}
          className="border focus:outline-none w-[150px] py-1 px-2 "
          placeholder={data.placeholder}
        />

        <span className="text-[10px] text-gray-400">
          At least 80 characters
        </span>
      </div>
    </div>
  );
}

export default BasicJobInput;