import { useState } from "react";
import ApplicantProfile from "./ApplicantProfile";
import Resume from "./Resume";
import HiringProgress from "./HiringProgress";
// import IntervieweSchedule from "./InterviewerSchedule";

const options = [
  "Applicant's Profile",
  "Resume",
  "Hiring Progress"
];

function SecondaryDetail(props) {
  const [currentOption, setCurrentOption] = useState(options[0]);
  //console.log(props)
  const getCurrentOption = () => {
    switch (currentOption) {
      case options[0]:
        return <ApplicantProfile {...props}/>;
      case options[1]:
        return <Resume {...props}/>;
      case options[2]:
        return <HiringProgress {...props}/>;
    }
  };

  return (
    <div className="w-full md:w-[65%] md:min-h-0 min-h-[620px] md:h-full flex flex-col border gap-[10px]">
      <ul className="border-b flex gap-[15px] w-full  items-center text-sm font-semibold">
        {options.map((current, index) => <li key={index} onClick={() => setCurrentOption(current)} className={`text-sm cursor-pointer p-2 ${current === currentOption ? 'border-b border-primaryColor' : 'border-0'}`}>{current}</li>)}
      </ul>

      {getCurrentOption()}
    </div>
  );
}

export default SecondaryDetail;
