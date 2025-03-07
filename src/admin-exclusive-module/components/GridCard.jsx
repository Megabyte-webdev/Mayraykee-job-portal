function GridCard({ data, navigateToSingle }) {
  const employer=data?.employer
  return (
    <div className="flex flex-col rounded-md items-center border border-gray-400 p-5 gap-3">
      <span className="font-semibold">{data?.name}</span>

      <div className="flex gap-2 w-full justify-between px-3">
        <span className="text-gray-600 font-semibold">company</span>
        <span className="break-all text-right">{employer?.company_name || "none"}</span>
      </div>

      <div className="flex gap-2 w-full justify-between px-3">
        <span className="text-gray-600 font-semibold">Email</span>
        <span className="break-all text-right">{data?.email}</span>
      </div>

      <div className="flex gap-2 w-full justify-between px-3">
        <span className="text-gray-600 font-semibold">Phone</span>
        <span className="break-all text-right">{employer?.phone_number || "none"}</span>
      </div>

      <div className="flex gap-2 w-full items-center justify-between px-3">
        <span className="text-gray-600 font-semibold">Status</span>
        <span className="break-all text-right">{employer?.status || "pending"}</span>
      </div>

    
        <button
          onClick={() => navigateToSingle(data)}
          className="hover:underline hover:bg-primaryColor cursor-pointer bg-green-600 text-white w-full p-2 rounded-md font-semibold"
        >
          Manage
        </button>
   
    </div>
  );
}

export default GridCard;
