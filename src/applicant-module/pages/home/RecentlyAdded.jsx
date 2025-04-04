import React from 'react'
import { MdOutlineMoreHoriz } from 'react-icons/md'
import { FormatTextToUppecase } from '../../../utils/formmaters'
import { stages } from "../../../utils/constants";

const RecentlyAdded = ({ newApplicant, newApp }) => {
  const dateCreated = new Date(newApp?.created_at)
  const getBorderColor = () => {
    switch (newApp?.status) {
      case stages[0].name:
        return "text-orange-500 border-lightorange";
      case stages[1].name:
        return "text-yellow-500 border-lightblue";
      case stages[2].name:
        return "text-darkblue border-darkblue";
      case stages[3].name.split("/")[0]:
        return "text-primaryColor border-primaryColor";
      case stages[3].name.split("/")[1]:
        return "text-[#8B0A1A] border-[#8B0A1A]";
    }
  };
  return (
    <div className="recent_added my-4 p-2 flex items-center rounded transition duration-75 hover:bg-gray-100 hover:translate-y-1">
      <div className="flex items-center w-full md:w-3/6">
        <div className="mr-2">
          <img src={newApplicant} className=" w-[60px]" alt="" />
        </div>
        <div className="">
          <p className="font-bold">{newApp.job_title}</p>
          <p>Company Name · Location · Job Type</p>
        </div>
      </div>
      <div className="w-1/6 hidden md:block">
        <p className="font-bold">Date Applied</p>
        <p>{dateCreated.toLocaleString('en-US', {weekday:'short', year:'numeric', month:'short', day:'numeric'})}</p>
      </div>
      <div className="w-1/6 hidden md:block">
        <button className={`border border-green-600 text-[12px] text-green-900 px-2 py-1 rounded-full uppercase ${getBorderColor()}`}>{FormatTextToUppecase(newApp.status == "in-review" ?"under-review": newApp.status)}</button>
      </div>
      <div className="w-1/6">
        <button className=" p-1"> <MdOutlineMoreHoriz /> </button>
      </div>
    </div>
  )
}

export default RecentlyAdded