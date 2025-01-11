function BasicInput({ data, details, onTextChange, value = null }) {
  return (
    <div className="w-full flex flex-col gap-[3px]">
      <label className="text-sm font-semibold">{data.label}</label>
      <input
        value={
          details[data?.name]
            ? data.type === "date"
              ? details[data?.name].split(" ")[0] // Extract the date part if it's a date input
              : details[data?.name] // Use as-is for other types
            : data.type === "date" && value
              ? value.split(" ")[0] // Extract the date part for non-empty fallback
              : value // Use the original value for other types
        }
        onChange={onTextChange}
        required={!details[data?.name]}
        className="p-2 border focus:outline-none min-w-[96%]"
        name={data.name}
        placeholder={data.placeholder}
        type={data.type === "date" ? "date" : data.type} // Ensure proper input type
      />


    </div>
  );
}

export default BasicInput;
