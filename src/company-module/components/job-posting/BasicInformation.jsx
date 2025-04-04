
import JobTypeItem from "./JobTypeItem";
import RangeSlider from "react-range-slider-input";
import "../style.css";
import { useEffect, useState } from "react";
import { FormatPrice } from "../../../utils/formmaters";
import BasicJobInput from "./BasicJobInput";
import QualificationsForm from "./QualificationsForm";
import SelectorInput from "./SelectorInput";
import useJobManagement from "../../../hooks/useJobManagement";
import { Country, State } from 'country-state-city'
import { resourceUrl } from "../../../services/axios-client";
import { toast } from "react-toastify";

const basic_inputs = [
  {
    id: 1,
    name: "email",
    label: "Contact Email",
    type: "text",
    placeholder: "e.g hr@example.com",
    prompt: "Here you input the company email",
    required: true
  },
  {
    id: 2,
    name: "preferred_age",
    label: "Minimum Age Limit",
    type: "number",
    placeholder: "e.g 18",
    min: 18,
    max: 100,
    prompt: "Here you input preferred average age (years)",
    verification: "At least 18 years",
    required: true
  },
  {
    id: 3,
    name: "application_deadline_date",
    label: "Application Deadline",
    type: "date",
    placeholder: "dd-mm-yyy",
    min:new Date().toISOString().split('T')[0],
    max:"4040-12-31",
    prompt: "Here you set an application deadline",
    required: true
  },
  {
    id: 4,
    name: "office_address",
    label: "Office Address",
    type: "text",
    placeholder: "e.g victoria Island, Lagos street",
    prompt: "Here you insert the office address",
    required: true
  },
  {
    id: 6,
    name: "search_keywords",
    label: "Search Keywords",
    type: "text",
    placeholder: "e.g Tech",
    prompt: "Here you specify search keywords",
    verification: "At least 4 characters",
    required: true
  },
  // {
  //   id: 7,
  //   name: "number_of_participants",
  //   label: "Number of epected participants",
  //   type: "number",
  //   placeholder: "e.g 2",
  //   min: 2,
  //   max: 50,
  //   prompt: "Here you specify the number of applicants you are expecting for this job",
  //   verification: "At least 1"
  // },
  // {
  //   id: 7,
  //   name: "experience",
  //   label: "Minimum years of Experience",
  //   type: "number",
  //   placeholder: "e.g 2",
  //   min: 2,
  //   max: 70,
  //   prompt: "Here you specify experience in years",
  //   verification: "At least 2 years"
  // },
];

const genderData = [
  {
    id: 1,
    name: "Not A Criteria",
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

function BasicInformation({ setCurrentStep, data, jobUtils, validateAndProceed }) {
  const { getEmployentTypes, getCurrencies, getSectors, getSubSectors } = useJobManagement();
  const [salaryRange, setSalaryRange] = useState([5000, 22000]);
  const [jobSectorList, setJobSectorList] = useState([]);
  const [selectedType, setSelectedType] = useState(jobUtils?.details?.type && jobUtils?.details?.type);
  const [currentQualification, setCurrentQualification] = useState("");
  const [selectedGender, setSelectedGender] = useState(jobUtils?.details?.salary_type && genderData?.find(one => one.name === jobUtils?.details?.gender));
  const [selectedSector, setSelectedSector] = useState();
  const [subSectorList, setSubSectorList] = useState(null);
  const [selectedSubSector, setSelectedSubSector] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(jobUtils?.details?.salary_type ? salaryTypeData?.find(one => one.name === jobUtils?.details?.salary_type) : salaryTypeData[1]);
  const [photoUrl, setPhotoUrl] = useState();
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [employementList, setEmployementList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [selectedLocation, setSelectedLocation] = useState();

  const toogleSelectedType = (selected) => {
    setSelectedType(selected);
    jobUtils.setDetails((prevDetails) => ({
      ...prevDetails,
      type: selected.name,
    }));
  };

  const getPhotoURL = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
   if (file && file.size > 1 * 1024 * 1024) {
      toast.error("File size exceeds the file size limit of 1MB.");
      e.target.value = null
      return
    }
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const generatedUrl = URL.createObjectURL(file);
      setPhotoUrl(generatedUrl);
      jobUtils.setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: file,
      }));
    } else {
      alert("Please select a valid JPEG or PNG file.");
    }
  };
  useEffect(() => {
    const initData = async () => {
      const employementListResult = await getEmployentTypes();
      const currencyResult = await getCurrencies();
      const sectors = await getSectors();
      setJobSectorList(sectors?.sort((a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase())))
      setEmployementList(employementListResult);
      const currencyWithCountry=currencyResult?.map((item)=>{
        const country = Country.getAllCountries().find(c => item.name?.startsWith(c.isoCode));
        return{
            ...item,
            name: `${item?.name} ${country ? `(${country?.name})` : ''}`,
        };
      })
      setCurrencyList(currencyWithCountry);
      if (employementListResult.length > 0) {
        setSelectedType(jobUtils.details.type
          && employementListResult?.find(one => one?.name === jobUtils?.details?.type));
      }
    };
    initData();
  }, []);

  useEffect(() => {
    let savedPhoto = null;
    if (savedPhoto === null && jobUtils.details?.featured_image) {
      // Check if the featured image is a Blob/File
      if (jobUtils.details.featured_image instanceof Blob || jobUtils.details.featured_image instanceof File) {
        savedPhoto = URL.createObjectURL(jobUtils.details.featured_image);
      } else {
        // If it's not a Blob/File, assume it's already a URL
        savedPhoto = `${resourceUrl}${jobUtils.details?.featured_image}`;
      }
      setPhotoUrl(savedPhoto);
    }
    return () => {
      if (savedPhoto) {
        URL.revokeObjectURL(savedPhoto);
      }
    };
  }, [jobUtils.details?.featured_image])

  useEffect(() => {
    if (jobUtils?.details?.location) {
      setSelectedLocation(State.getStatesOfCountry('NG')?.find(one => one.name === jobUtils?.details.location));
    }
  }, [jobUtils?.details?.location]);

  useEffect(() => {
    setSelectedType(jobUtils.details.type
      && employementList?.find(one => one?.name === jobUtils?.details?.type));
  }, [employementList]);

  useEffect(() => {
    setSelectedCurrency(jobUtils.details.currency
      ? currencyList?.find(one => one?.name === jobUtils?.details?.currency)
      : null);
  }, [currencyList]);
  useEffect(() => {
   if (jobSectorList && jobUtils?.details?.sector) {
      const sector = jobUtils?.details?.sector
        ? jobSectorList?.find(one => one?.name === jobUtils?.details?.sector)
        : null;

      setSelectedSector(sector);
      // Set subsectors list based on the selected sector
      setSubSectorList(sector?.subsections || []);
      // Find the selected subsector or default to the first one in the subsector list
      const subsector = jobUtils?.details?.subsector
        ? sector?.sub_sectors?.find(one => one?.name === jobUtils?.details?.subsector)
        : null;
      setSelectedSubSector(subsector?.sort((a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
    }
  }, [jobSectorList, jobUtils?.details?.sector]);

  useEffect(() => {
    if (selectedSector) {
      setSubSectorList(selectedSector?.sub_sectors?.sort((a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase())) || []);
      const matchingSubsector = selectedSector?.sub_sectors?.find(
        (one) => one?.name === jobUtils?.details?.subsector
      );
      setSelectedSubSector(matchingSubsector);
    }
  }, [selectedSector]);

  useEffect(() => {
    if (selectedSubSector) {
      jobUtils.setDetails((prevDetails) => ({
        ...prevDetails,
        subsector: selectedSubSector?.name,
      }));
    }
  }, [selectedSubSector]);

  useEffect(() => {
    jobUtils.setDetails((prevDetails) => ({
      ...prevDetails,
      gender: selectedGender?.name || prevDetails.gender,
      salary_type: selectedSalary?.name || prevDetails.salary_type,
      currency: selectedCurrency?.name || prevDetails.currency,
      sector: selectedSector?.name || prevDetails.sector,
      subsector: selectedSubSector?.name || prevDetails.subsector,
      location: selectedLocation?.name || prevDetails.location,
    }));
  }, [
    selectedCurrency,
    selectedGender,
    selectedSalary,
    selectedSector,
    selectedSubSector,
    selectedLocation,
  ]);

  // Validation function before proceeding to the next step
  const handleValidateAndProceed = () => {
    // Add your validation logic here
    const isValid = validateForm();
    if (isValid) {
      validateAndProceed();
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const validateForm = () => {
    // Check if essential fields are filled. Modify as necessary.
    if (!selectedSector || !selectedSubSector || !selectedSalary) {
      return false;
    }
    return true;
  };

  return (
    <div className="flex flex-col w-full p-4 gap-4">
      {/* Basic Info */}
      <div className="flex flex-col gap-4 border-b pb-2">
        <h3 className="text-gray-700 text-lg font-semibold">
          Basic Information
        </h3>
        <span className="text-sm text-gray-400">
          This Information will be displayed publicly
        </span>
      </div>
      {/* Featured Image */}
      <div className="flex flex-col sm:flex-row gap-4 items-center border-b py-4">
        <div className="flex flex-col w-full sm:max-w-[25%] gap-2">
          <h3 className="text-gray-700 text-sm font-semibold flex gap-1">
            Featured Image <strong className="text-red-500">*</strong>
          </h3>
          {/* <span className="text-xs text-gray-400">
            Here you upload image for job
          </span> */}
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
              accept=".png, .jpg, .jpeg"
              name="featured_image"
              type="file"
              className="hidden"
            />
          </div>
          <small class="text-xs text-gray-400 max-w-40 text-center">
            File size should not exceed 1MB. Only *.jpeg, .png, .jpg* are allowed.
          </small>

        </div>
      </div>
      <SelectorInput
        data={{
          label: "Sector",
          prompt: "Here you input the job sector",
          name: "sector",
        }}
        listData={jobSectorList}
        jobUtils={jobUtils}
        selected={selectedSector}
        setSelected={(sector) => {
          setSelectedSector(sector);
          // Update job details only for the sector
          jobUtils.setDetails((prevDetails) => ({
            ...prevDetails,
            sector: sector?.name,
          }));
        }}
      />

      <SelectorInput
        data={{
          label: "Sub-Sector",
          prompt: "Here you select subsector based on the job sector",
          name: "subsector",
          required: true 
        }}
        listData={subSectorList}
        jobUtils={jobUtils}
        selected={selectedSubSector}
        setSelected={(subsector) => {
          setSelectedSubSector(subsector);
          // Update job details only for the subsector
          jobUtils.setDetails((prevDetails) => ({
            ...prevDetails,
            subsector: subsector?.name,
          }));
        }}
      />

      {/* Basic Inputs */}
      {basic_inputs.map((current) => (
        <BasicJobInput key={current.id} data={current} jobUtils={jobUtils} />
      ))}
      {/* Employment Types */}
      <div className="flex flex-col sm:flex-row gap-4 border-b py-4">
        <div className="flex flex-col gap-2 w-full sm:max-w-[25%]">
          <h3 className="text-gray-700 text-sm font-semibold flex gap-1">
            Type of Employment <strong className="text-red-500">*</strong>
          </h3>
          {/* <span className="text-xs text-gray-400">
            You can select multiple types of employment
          </span> */}
        </div>

        <div className="flex flex-col gap-2">
          {employementList.map((current) => (
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
      <SelectorInput
        key={134}
        data={{
          label: "Location",
          prompt: "Here you select job location",
          name: "location",
          required: true
        }}
        listData={State.getStatesOfCountry('NG')}
        jobUtils={jobUtils}
        selected={selectedLocation}
        setSelected={setSelectedLocation}
      />

      <QualificationsForm jobUtils={jobUtils} />

      {/* Dropdown Options */}
      <SelectorInput
        key={1}
        data={{
          label: "Gender",
          prompt: "Here you select preferred Gender",
          name: "gender",
          required: true
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
          required: true
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
          required: true
        }}
        listData={currencyList}
        jobUtils={jobUtils}
        selected={selectedCurrency}
        setSelected={setSelectedCurrency}
      />
      {/* Salary */}
      <div className="flex flex-col sm:flex-row gap-4 border-b py-4">
        <div className="flex flex-col gap-2 sm:max-w-[25%] w-full">
          <h3 className="text-gray-700 text-sm font-semibold flex gap-1">Salary<strong className="text-red-500">*</strong></h3>
          {/* <span className="text-xs text-gray-400">
            Please specify the estimated salary range for the role. *You can
            leave this blank.
          </span> */}
        </div>
        <div className="flex flex-col w-full sm:w-[50%] gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Min Value</label>
              <div className="p-1 border border-gray-400">
                <span className="mx-1">{selectedCurrency?.code}</span>
                <input
                  type="number"
                  min="0"
                  className="w-24 ring-0 outline-0"
                  value={jobUtils.details.min_salary || ""}
                  onChange={(e) => {
                      jobUtils.setDetails({
                        ...jobUtils.details,
                        min_salary: e.target.value,
                      });
                  }}
                />
              </div>
            </div>
            <span>to</span>
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Max Value</label>
              <div className="p-1 border border-gray-400">
                <span className="mx-1">{selectedCurrency?.code}</span>
                <input
                  type="number"
                  className="w-24 ring-0 outline-0"
                  min="0"
                  value={jobUtils.details.max_salary || ""}
                  onChange={(e) => {
                      jobUtils.setDetails({
                        ...jobUtils.details,
                        max_salary: e.target.value,
                      });
                  }}
                />
              </div>
            </div>
          </div>
          {/* 
          <RangeSlider
            min={minimumPrice}
            max={minimumPrice + 100000}
            step={500}
            value={[
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
          /> */}
        </div>

      </div>
      <button
        onClick={validateAndProceed}
        className="p-2 place-self-end mt-4 font-semibold w-fit text-sm bg-primaryColor text-white"
      >
        Next Step
      </button>
    </div>
  );
}

export default BasicInformation;
