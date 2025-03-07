import React from "react";
import mayrahkeeIcon from "../../assets/pngs/mayrakee-icon.png";
import interviewIcon from "../../assets/svgs/interview-icon.svg";
import managerAttireIcon from "../../assets/manager-business-attire.jpg";
import mainSideImg from "../../assets/happy-couple-of-african-american-business-partners-2023-11-27-05-18-22-utc.jpg";
import mainLogoTwo from "../../assets/pngs/mayrahkee-logo-2.png";


function SideCard() {
  return (
    <div className="h-full w-[50%] hidden md:flex flex-col justify-start items-center  bg-primaryColor pt-[5%]">
      <a href="https://mayrahkeeafrica.vercel.app/" className="w-[50%] h-[15%]"><img src={mainLogoTwo} className="object-contain" /></a>
      <img
        src={mainSideImg}
        className="w-[80%] max-w-[400px] h-[50%] object-fit mt-[2%] rounded-[30px] border shadow shadow-gray-800"
      />
      <span className="text-lg mt-5 text-white font-bold">
        Find top candidates around the globe
      </span>
      <span className="text-sm w-80 text-center  mt-2 text-white ">
        We connect employers and creative candidate with diverse multi-cultural backgrounds, qualifications and work experiences.
      </span>
    </div>
  );
}

export default React.memo(SideCard);
