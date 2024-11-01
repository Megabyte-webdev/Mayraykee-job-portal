import JobTypeItem from "./JobTypeItem";
import RangeSlider from "react-range-slider-input";
import "../style.css";
import { useEffect, useState } from "react";
import { FormatPrice } from "../../../utils/formmaters";
import BasicJobInput from "./BasicJobInput";
import QualificationsForm from "./QualificationsForm";
import SelectorInput from "./SelectorInput";

const basic_inputs = [
  {
    id: 1,
    name: "email",
    label: "Contact Email",
    type: "text",
    placeholder: "e.g hr@example.com",
    prompt: "Here you input the company email",
  },
  {
    id: 2,
    name: "sector",
    label: "Sector",
    type: "text",
    placeholder: "e.g IT",
    prompt: "Here you input the job sector",
  },
  {
    id: 3,
    name: "preferred_age",
    label: "Application Age Limit",
    type: "number",
    placeholder: "e.g 18",
    prompt: "Here you input preferred average age (years)",
  },
  {
    id: 4,
    name: "application_deadline_date",
    label: "Application Deadline",
    type: "date",
    placeholder: "e.g some date",
    prompt: "Here you set an application deadline",
  },
  {
    id: 5,
    name: "office_address",
    label: "Office Address",
    type: "text",
    placeholder: "e.g victoria Island, Lagos street",
    prompt: "Here you insert the office address",
  },
  {
    id: 6,
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "e.g 11.023 20.345",
    prompt: "Here you insert the longitude and latitude",
  },
  {
    id: 7,
    name: "search_keywords",
    label: "Search Keywords",
    type: "text",
    placeholder: "e.g networks engineer",
    prompt: "Here you specify search keywords",
  },
  {
    id: 8,
    name: "experience",
    label: "Minimum years of Experience",
    type: "number",
    placeholder: "e.g 2 years",
    prompt: "Here you specify experience in years",
  },
];

const job_types = [
  {
    id: 1,
    name: "Full Time",
  },
  {
    id: 2,
    name: "Part Time",
  },
  {
    id: 3,
    name: "Remote",
  },
  {
    id: 4,
    name: "Internship",
  },
  {
    id: 5,
    name: "Contract",
  },
];

const genderData = [
  {
    id: 1,
    name: "Any",
  },
  {
    id: 2,
    name: "Male",
  },
  {
    id: 3,
    name: "Female",
  },
];

const salaryTypeData = [
  {
    id: 1,
    name: "Weekly",
  },
  {
    id: 2,
    name: "Monthly",
  },
  {
    id: 3,
    name: "Yearly",
  },
];

const currencyData = [
  {
    id: 1,
    name: "Naira (N)",
  },
  {
    id: 2,
    name: "Cedes (C)",
  },
  {
    id: 3,
    name: "Dollars ($)",
  },
  {
    id: 4,
    name: "Euros (E)",
  },
  {
    id: 5,
    name: "Pounds (P)",
  },
];

function BasicInformation({ setCurrentStep, data, jobUtils }) {
  const [salaryRange, setSalaryRange] = useState([5000, 22000]);
  const [selectedType, setSelectedType] = useState();
  const [currentQualification, setCurrentQualification] = useState("");
  const [selectedGender, setSelectedGender] = useState(genderData[0]);
  const [selectedSalary, setSelectedSalary] = useState(salaryTypeData[1]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyData[0]);
  const [photoUrl, setPhotoUrl] = useState();

  const toogleSelectedType = (selected) => {
    setSelectedType(selected);
    jobUtils.setDetails({ ...jobUtils.details, type: selected.name });
  };

  const getPhotoURL = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const generatedUrl = URL.createObjectURL(file);
      setPhotoUrl(generatedUrl);
      jobUtils.setDetails({ ...jobUtils.details, [name]: file });
    } else {
      alert("Please select a valid JPEG or PNG file.");
    }
  };

  useEffect(() => {
    jobUtils.setDetails({
      ...jobUtils.details,
      ["gender"]: selectedGender.name,
      ["salary_type"]: selectedSalary.name,
      ["currency"]: selectedCurrency.name,
    });
  }, [selectedCurrency, selectedGender, selectedSalary]);

  return (
    <div className="flex flex-col w-full p-4 gap-4">
      {/* Basic Info */}
      <div className="flex flex-col gap-4 border-b pb-2">
        <h3 className="text-gray-700 text-lg font-semibold">Basic Information</h3>
        <span className="text-sm text-gray-400">
          This Information will be displayed publicly
        </span>
      </div>

      {/* Featured Image */}
      <div className="flex flex-col sm:flex-row gap-4 items-center border-b py-4">
        <div className="flex flex-col w-full sm:max-w-[25%] gap-2">
          <h3 className="text-gray-700 text-sm font-semibold">Featured Image</h3>
          <span className="text-xs text-gray-400">
            Here you upload image for job
          </span>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <label
            htmlFor="photo_url"
            className="text-sm text-primaryColor hover:underline cursor-pointer"
          >
            Upload
          </label>
          <div className="flex flex-col h-[80px] w-[80px] border border-dashed p-1 border-gray-400">
            {photoUrl && (
              <img
                src={photoUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
            <input
              id="photo_url"
              onChange={getPhotoURL}
              name="featured_image"
              type="file"
              className="hidden"
            />
          </div>
          <span className="text-xs text-gray-400">Only JPEG or PNG</span>
        </div>
      </div>

      {/* Basic Inputs */}
      {basic_inputs.map((current) => (
        <BasicJobInput key={current.id} data={current} jobUtils={jobUtils} />
      ))}

      {/* Employment Types */}
      <div className="flex flex-col sm:flex-row gap-4 border-b py-4">
        <div className="flex flex-col gap-2 w-full sm:max-w-[25%]">
          <h3 className="text-gray-700 text-sm font-semibold">
            Type of Employment
          </h3>
          <span className="text-xs text-gray-400">
            You can select multiple types of employment
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {job_types.map((current) => (
            <JobTypeItem
              key={current.id}
              selectedType={selectedType}
              toogleSelectedType={toogleSelectedType}
              data={current}
              jobUtils={jobUtils}
            />
          ))}
        </div>
      </div>

      {/* Job Title */}
      <QualificationsForm jobUtils={jobUtils} />

      {/* Dropdown Options */}
      <SelectorInput
        key={1}
        data={{
          label: "Gender",
          prompt: "Here you select preferred Gender",
          name: "gender",
        }}
        listData={genderData}
        jobUtils={jobUtils}
        selected={selectedGender}
        setSelected={setSelectedGender}
      />

      <SelectorInput
        key={2}
        data={{
          label: "Salary Type",
          prompt: "Here you select how the job pays",
          name: "salary_type",
        }}
        listData={salaryTypeData}
        jobUtils={jobUtils}
        selected={selectedSalary}
        setSelected={setSelectedSalary}
      />

      <SelectorInput
        key={3}
        data={{
          label: "Currency",
          prompt: "Here you select the currency",
          name: "currency",
        }}
        listData={currencyData}
        jobUtils={jobUtils}
        selected={selectedCurrency}
        setSelected={setSelectedCurrency}
      />

      {/* Salary */}
      <div className="flex flex-col sm:flex-row gap-4 border-b py-4">
        <div className="flex flex-col gap-2 sm:max-w-[25%] w-full">
          <h3 className="text-gray-700 text-sm font-semibold">Salary</h3>
          <span className="text-xs text-gray-400">
            Please specify the estimated salary range for the role. *You can
            leave this blank.
          </span>
        </div>

        <div className="flex flex-col w-full sm:w-[50%] gap-4">
          <div className="flex items-center justify-between">
            <span className="border p-1">
              {FormatPrice(jobUtils.details.min_salary)}
            </span>
            <span>to</span>
            <span className="border p-1">
              {FormatPrice(jobUtils.details.max_salary)}
            </span>
          </div>

          <RangeSlider
            min={0}
            max={100000}
            step={500}
            defaultValue={[
              jobUtils.details.min_salary,
              jobUtils.details.max_salary,
            ]}
            onInput={(range) => {
              jobUtils.setDetails({
                ...jobUtils.details,
                min_salary: range[0],
                max_salary: range[1],
              });
            }}
          />
        </div>
      </div>

      <button
        onClick={() => setCurrentStep(data[1])}
        className="p-2 place-self-end mt-4 font-semibold w-fit text-sm bg-primaryColor text-white"
      >
        Next Step
      </button>
    </div>
  );
}

export default BasicInformation;
