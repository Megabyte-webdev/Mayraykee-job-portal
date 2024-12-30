import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

function QualificationsForm({ jobUtils }) {
  const [currentQualification, setCurrentQualification] = useState("");

  const addQualification = () => {
    if (currentQualification) {
      const newList = [
        ...(jobUtils.details?.qualification || []),
        currentQualification,
      ];
      jobUtils.setDetails({ ...jobUtils.details, qualification: newList });
      setCurrentQualification('');
    }
  };

  const removeQualification = (index) => {
    const newList = [...jobUtils.details?.qualification];
    newList.splice(index, 1);
    jobUtils.setDetails({ ...jobUtils.details, qualification: newList });
  };

  const qualificationList = jobUtils?.details?.qualification?.map((current, index) => {
    return (
      <li key={index} className="relative border py-[3px] flex px-1 text-little text-white bg-primaryColor/80 truncate">
        {current}
        <IoIosCloseCircleOutline onClick={() => removeQualification(index)} className="absolute top-1 right-1 text-lg cursor-pointer text-red-800" />
      </li>
    );
  });

  useEffect(() => console.log(jobUtils.details.qualification), [jobUtils.details.qualification]);

  return (
    <div className="flex flex-col md:flex-row gap-[15%] border-b py-2 ">
      <div className="flex flex-col w-full md:max-w-[25%] gap-[10px]">
        <h3 className="text-gray-700 text-sm font-semibold">Required Qualifications</h3>
        <span className="text-little text-gray-400 w-full md:w-auto mb-2 md:mb-0">
          Add required qualifications for the job
        </span>
      </div>

      <div className="flex flex-col gap-[10px] w-full">
        <div className="flex gap-[10px]">
          <input
            value={currentQualification}
            onChange={(e) => setCurrentQualification(e.target.value)}
            placeholder="e.g masters degree"
            className="w-[120px] p-1 outline-none border text-little"
          />
          <button onClick={addQualification} className="border p-1 w-fit text-little hover:bg-primaryColor hover:text-white border-primaryColor text-primaryColor">
            Add Qualification
          </button>
        </div>

        <ul className="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
          {qualificationList}
        </ul>
      </div>
    </div>
  );
}

export default QualificationsForm;
