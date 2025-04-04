import { useEffect, useState } from "react";
import BasicJobInput from "./BasicJobInput";
import DescriptionItem from "./DescriptionItem";
import SelectorInput from "./SelectorInput";
import FormButton from "../../../components/FormButton";

const descriptions = [
  {
    id: 1,
    title: "Responsibilities (required)",
    name: "job_description",
    desc: "Job responsibilities must be describe by one position",
    placeholder: "List out all Responsibilities",
    required: true
  },
  {
    id: 2,
    title: "Qualifications",
    name: "experience",
    desc: "Outline the qualifications required for the Job",
    placeholder: "Begin to type...",
    required: true
  },
];

const basic_inputs = [
  {
    id: 1,
    name: "job_title",
    label: "Job Title (required)",
    type: "text",
    placeholder: "e.g FrontEnd Dev",
    prompt: "Here you state the job title",
    required: true
  },
  {
    id: 2,
    name: "external_url",
    label: "External URL ",
    type: "text",
    placeholder: "e.g https://externalurl.com",
    prompt: "Here you can add any external url",
  },
  {
    id: 3,
    name: " introduction_video_url",
    label: "Intro Video URL",
    type: "text",
    placeholder: "e.g https://introvideourl.com",
    prompt: "Here you add intro video url",
  },
];

const careerData = [
  {
    id: 1,
    name: "Internship",
  },
  {
    id: 2,
    name: "Management Trainee ",
  },
  {
    id: 3,
    name: "Entry level",
  },
  {
    id: 4,
    name: "Intermediate level",
  },
  {
    id: 5,
    name: "Middle level",
  },
  {
    id: 6,
    name: "Senior level",
  },
  {
    id: 7,
    name: "Management level",
  },
  {
    id: 8,
    name: "Executive ",
  },
  {
    id: 9,
    name: "Board of Directors",
  },
];

function Descriptions({
  data,
  setCurrentStep,
  jobUtils,
  handleSuccess,
  exclusive,
  editJob
}) {
  const [selectedCareerLevel, setSelectedCareerLevel] = useState(
    jobUtils.details.career_level
      ? careerData.find((one) => one.name === jobUtils.details.career_level)
      : careerData[1]
  );

  useEffect(() => {
    jobUtils.setDetails({
      ...jobUtils.details,
      ["career_level"]: selectedCareerLevel?.name,
    });
  }, [selectedCareerLevel]);

  return (
    <div className="flex w-full flex-col p-2">
      {/* Descriptions */}
      <div className="flex flex-col gap-[15px] border-b pb-2">
        <h3 className="text-gray-700 text-sm font-semibold">Details</h3>
        <span className="text-little text-gray-600">
          Add the description of the job, responsibilities, who you are, and
          nice-to-haves.{" "}
        </span>
      </div>

      {/* Basic Inputs */}
      {basic_inputs.map((current) => (
        <BasicJobInput key={current.id} data={current} jobUtils={jobUtils} />
      ))}

      {/* Job Description */}
      <>
        {descriptions.map((current, index) => (
          <DescriptionItem key={index} data={current} jobUtils={jobUtils} />
        ))}
      </>

      {/*  */}
      <SelectorInput
        key={1}
        data={{
          label: "Career Level",
          prompt: "Here you select prefered career level",
          name: "career_level",
          required: true
        }}
        listData={careerData}
        jobUtils={jobUtils}
        selected={selectedCareerLevel}
        setSelected={setSelectedCareerLevel}
      />

      <div className="w-full flex  mt-[10px] justify-between">
        <button
          onClick={() => setCurrentStep(data[0])}
          className="p-2 place-self-end  font-semibold w-fit text-little bg-primaryColor text-white"
        >
          Previous Step
        </button>

        <FormButton
          width="w-[100px]"
          height="h-fit p-2"
          onClick={() => {
            if (exclusive?.id) {
              console.log('Exclusive')
              jobUtils.addJobForExclusive(() => {
                handleSuccess();
              }, exclusive.id);
            }else {
              console.log('Normal')
              if(editJob){
              jobUtils.editCurrentJob(() => {
                handleSuccess();
              });
            } else{
              jobUtils.addJob(() => {
                handleSuccess();
              });
            }
              
            }
          }}
          loading={jobUtils.loading}
        >
          {editJob ?"Edit Job" : "Add Job"}
        </FormButton>
      </div>
    </div>
  );
}

export default Descriptions;
