function HeaderAttribute({ data }) {
  return (
    <div className="w-[23%] flex items-end gap-[5px]">
      <div className="h-[30px] items-center flex">
      {<data.icon />}
      </div>
      <div className="flex flex-col">
        <span className="text-little text-gray-400">{data.title}</span>
        <a href={data.content} className="text-little cursor-pointer hover:underline font-semibold text-black">{data.content}</a>
      </div>
    </div>
  );
}

export default HeaderAttribute;
