import React, { useContext, useEffect, useState } from "react";
import { TbPhoto } from "react-icons/tb";
import DynamicExperienceForm from "./DynamicExperienceForm";
import SocialsForm from "./SocialsForm";
import { BASE_URL, IMAGE_URL } from "../../../../utils/base";
// import UiSelect from '../../../components/general/UiSelect'
import axios from "axios";
import { IoCheckboxSharp } from "react-icons/io5";
import {
  MdCheck,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { AuthContext } from "../../../../context/AuthContex";
import { ResourceContext } from "../../../../context/ResourceContext";
import TextEditor from "./TextEditor";
import { onSuccess } from "../../../../utils/notifications/OnSuccess";
import { Country, State, City } from "country-state-city";

const BasicInfo = ({ setIsOpen }) => {
  const { getCandidate, setGetCandidate } = useContext(ResourceContext);
 
  const candidate = getCandidate.data?.details;
  const countries = Country.getAllCountries();
  const states = State.getAllStates();
  const cities = City.getAllCities();

  const { authDetails, userUpdate, setUserUpdate } = useContext(AuthContext);
  const user = authDetails?.user;
  const [errorMsg, setErrorMsg] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [selectStates, setSelectStates] = useState(candidate?.country ? State.getStatesOfCountry(countries?.find(one=> one.name === candidate.country)?.isoCode):[]);
  const [selectState, setSelectState] = useState();
  const [selectCity, setSelectCity] = useState(candidate?.state ? City.getCitiesOfState(countries?.find(one=> one.name === candidate.country)?.isoCode, states?.find(one=> one.name === candidate.state)?.isoCode):[]);
  const [countryInfo, setCountryInfo] = useState();
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [socialHandles, setSocialHandles] = useState([
    { network: "", url: "" },
  ]);
  // useEffect(() => {
  //   console.log(countryInfo)
  //   console.log(details)
  // },[countryInfo])
  useEffect(() => {
    setGetCandidate((prev) => {
      return {
        ...prev,
        isDataNeeded: true,
      };
    });
  }, []);


//console.log(candidate)
  const toggleAccept = () => {
    setDetails((prev) => {
      return {
        ...prev,
        show_my_profile: !details.show_my_profile,
      };
    });
  };
  useEffect(() => {
    if (candidate?.languages) {
      setSelectedLanguages(candidate?.languages?.split(","));
    }
  }, [candidate?.languages]);
  const [profileImageUrl, setProfileImageUrl] = useState(
    user.image ? user.image : null
  );
  const [details, setDetails] = useState({
    candidate_id: user.id ? user.id : "",
    // full_name: user.full_name ? user.full_name : "",
    profile: candidate?.profile || null,
    full_name: user?.first_name ? ` ${user.first_name} ${user.last_name}` : "",
    date_of_birth: candidate?.date_of_birth ? candidate?.date_of_birth : "",
    gender: candidate?.gender ? candidate?.gender : "",
    phone_number: candidate.phone_number ? candidate?.phone_number : "",
    email: candidate.email ? candidate?.email : "",
    background_profile: null,
    password: user?.password ? user.password : "",
    means_of_identification: candidate?.means_of_identification
      ? candidate?.means_of_identification
      : "",
    nin: candidate?.nin ? candidate?.nin : "",
    nin_slip: null,
    educational_qualification: candidate?.educational_qualification
      ? candidate?.educational_qualification
      : "",
    work_experience: candidate?.work_experience
      ? candidate?.work_experience
      : "",
    languages: selectedLanguages,
    salary_type: candidate?.salary_type ? candidate?.salary_type : "",
    salary: candidate?.salary ? candidate?.salary : "",
    categories: candidate?.categories ? candidate?.categories : "",
    // show_my_profile: true,
    preferred_job_role: candidate.preferred_job_role
      ? candidate?.preferred_job_role
      : "",
    personal_profile: candidate.personal_profile
      ? candidate?.personal_profile
      : "",
    network: candidate.network ? candidate?.network : "",
    contact_address: candidate.contact_address
      ? candidate?.contact_address
      : "",
    country: candidate.country ? candidate?.country : "",
    state: candidate.state ? candidate?.state : "",
    local_gov: candidate.local_gov ? candidate?.local_gov : "",
    address: candidate.address ? candidate?.address : "",
    experience: candidate.experience ? candidate?.experience : "",
    introduction_video: null,
    social_media_handle: [],
  });

  useEffect(()=>{
    console.log(details)
  },[details])
  function updateFirstLetter(word) {
    if (word) {
      return setSelectId(word[0]?.toUpperCase() + word.slice(1));
    } else {
      return setSelectId(null);
    }
  }

  // console.log(getAllFaculty.data)
  // const handleOnChange = (e) => {
  //     const { value, name, files, type, checked } = e.target;
  //     if (name === "means_of_identification") {
  //         updateFirstLetter(value)
  //     }
  //     setDetails((prev) => {
  //         return {
  //             ...prev,
  //             [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
  //             // [name]: name === 'cv' ? files[0] : value,
  //         };
  //     });
  //     setErrorMsg(null);
  // };

  // console.log(getAllFaculty.data)
  const handleOnChange = (e) => {
    const { value, name, files, type, checked } = e.target;
    // let countryInfo = {}
    if (name === "means_of_identification") {
      updateFirstLetter(value);
    }
    if (name === "country") {
      const countryInfoDetails = Country.getCountryByCode(countries?.find(one=> one.name === value)?.isoCode);
      setCountryInfo(countryInfoDetails);
      const states = State.getStatesOfCountry(countryInfoDetails?.isoCode);
      setSelectStates(states);
      // setDetails((prev) => {
      //   return {
      //     ...prev,
      //     [name]:
      //       type === "checkbox"
      //         ? checked
      //         : type === "file"
      //         ? files[0]
      //         : countryInfoDetails?.name,
      //     // [name]: name === 'cv' ? files[0] : value,
      //   };
      // });
    } else if (name == "state") {
      console.log(countryInfo)
      const cities = City.getCitiesOfState(countryInfo.isoCode, value);
      setSelectCity(cities);
      const stateName = State.getStateByCode(value, countryInfo.isoCode);
      setSelectState(stateName);
      setDetails((prev) => {
        return {
          ...prev,
          [name]:
            type === "checkbox"
              ? checked
              : type === "file"
              ? files[0]
              : cities.name,
          // [name]: name === 'cv' ? files[0] : value,
        };
      });
    }

    setDetails((prev) => {
      return {
        ...prev,
        [name]:
          type === "checkbox" ? checked : type === "file" ? files[0] : value,
        // [name]: name === 'cv' ? files[0] : value,
      };
    });

    if (name === "languages") {
      const selectedLanguageOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      // console.log(selectedLanguageOptions)
      if (!languageState(...selectedLanguageOptions)) {
        setDetails((prevDetails) => ({
          ...prevDetails,
          languages: [...selectedLanguages, ...selectedLanguageOptions].join(
            ","
          ),
        }));
        setSelectedLanguages([
          ...selectedLanguages,
          ...selectedLanguageOptions,
        ]);
      } else {
        const newList = selectedLanguages.filter(
          (current) => current !== selectedLanguageOptions[0]
        );
        setSelectedLanguages([...newList]);
      }
    }
    setErrorMsg(null);
  };

  const handleOutline = (event) => {
    setDetails((prev) => {
      return {
        ...prev,
        experience: event,
      };
    });
    setErrorMsg("");
  };

  const languageState = (language) =>
    selectedLanguages?.find((current) => current === language) ? true : false;


  useEffect(() => {
    setDetails((details) => {
      return {
        ...details,
        social_media_handle: socialHandles,
      };
    });
  }, [socialHandles]);

  const handleSubmit = (e) => {
    console.log(details)
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    setGetCandidate((prev) => {
      return {
        ...prev,
        isDataNeeded: false,
      };
    });
    // details.country = countryInfo?.name;
    // details.state = selectState;
    axios
      .post(`${BASE_URL}/candidate/UpdateCandidate/${user.id}`, details, {
        headers: {
          Authorization: `Bearer ${authDetails.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        onSuccess({
          message: "Profile",
          success: response.data.message,
        });
        localStorage.setItem(
          "userDetails",
          JSON.stringify(response.data.candidate)
        );
        // setUserUpdate(updateData)
        setLoading(false);
        setIsOpen(false);
        setGetCandidate((prev) => {
          return {
            ...prev,
            isDataNeeded: true,
          };
        });
        // toast.success("successful");
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setErrorMsg({ stack: error.response.data.message });
          setShowMsg(true);
          setLoading(false);
        } else {
          console.log(error);
          setErrorMsg({ network: error.message });
          setShowMsg(true);
          setLoading(false);
        }
      });
  };
  const getImageURL = (e) => {
    const { name } = e.target;
    const file = e.target.files[0]; //filelist is an object carrying all details of file, .files[0] collects the value from key 0 (not array), and stores it in file

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      // You can also perform additional actions with the valid file
      const generatedUrl = URL.createObjectURL(file);
      setProfileImageUrl(generatedUrl);
      setDetails({ ...details, [name]: file });
    } else {
      // Handle invalid file type
      alert("Please select a valid JPEG or PNG file.");
    }
  };

  const findLanguage = (lang) =>
    selectedLanguages.find((current) => current === lang) ? true : false;

  const handleLanguageSelect = (lang) => {
    let newList = [];
    if (findLanguage(lang)) {
      newList = selectedLanguages.filter((current) => current !== lang);
      setSelectedLanguages([...newList]);
      return;
    }

    newList = [...selectedLanguages, lang];
    setSelectedLanguages([...newList]);
  };

  useEffect(() => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      languages: [...selectedLanguages].join(","),
    }));
  }, [selectedLanguages]);


  return (
    <div className="max-w-full text-[#515B6F] text-base overflow-x-hidden">
      <div className="my-4">
        <div className="max-w-full flex flex-wrap gap-2 items-center pb-6 border-b">
          <div className="max-w-full md:w-1/3 pr-5">
            <p className="font-medium mb-2 text-slate-950">Profile Photo</p>
            <p>
              This image will be shown publicly as your profile picture, it will
              help recruiters recognize you!
            </p>
          </div>
          <div className="w-full flex justify-center items-center flex-wrap gap-2">
            <div className="size-[100px]  ring-green-200 ring-4 rounded-full bg-gray-300 mx-5">
              <div className="">
                <img
                  className="w-[100px] h-[100px] rounded-full"
                  src={
                    profileImageUrl
                      ? profileImageUrl
                      : `${IMAGE_URL}/${candidate.profile}`
                  }
                  alt=""
                />
              </div>
            </div>
            <label
              htmlFor="image"
              className="min-h-32 w-[90%] md:min-w-96 cursor-pointer bg-green-50 border-2 border-green-500 border-dashed p-3 md:p-5 rounded"
            >
              <div className="text-center">
                <div className="flex justify-center">
                  <span className="text-green-500 mb-3">
                    <TbPhoto />
                  </span>
                </div>
                <p>
                  <span className="text-green-500 font-medium">
                    Click to replace{" "}
                  </span>
                  or drag and drop
                </p>
                <p>SVG, PNG, JPG or GIF (max. 400 x 400px)</p>
                <input
                  type="file"
                  accept=".jpeg, .png, .jpg,"
                  name="profile"
                  onChange={getImageURL}
                  id="image"
                  className="invisible "
                />
              </div>
            </label>
          </div>
        </div>
        <div className="update_form py-6">
          <div>
            <form onSubmit={handleSubmit}>
              <div className=" md:w-">
                <div className="border-b py-6">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="font-medium w-full md:w-2/6 text-slate-900">
                      <p>Personal Information</p>
                    </div>
                    <div className="w-full md:w-4/6">
                      <div className="mb-4">
                        <label className="block">
                          <span className="block text-sm font-medium text-slate-700">
                            Full Name
                          </span>
                          <input
                            type="text"
                            value={details.full_name}
                            name="full_name"
                            onChange={handleOnChange}
                            className="mt-1 block p-1 focus:outline-none w-full border"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700">
                              Phone Number
                            </span>
                            <input
                              type="text"
                              value={details.phone_number}
                              name="phone_number"
                              onChange={handleOnChange}
                              placeholder="+44 1245 572 135"
                              className="mt-1 block p-1 focus:outline-none w-full border"
                            />
                          </label>
                        </div>
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700">
                              Email
                            </span>
                            <input
                              type="email"
                              value={details.email}
                              name="email"
                              onChange={handleOnChange}
                              placeholder="Jakegyll@gmail.com"
                              className="mt-1 block p-1 focus:outline-none w-full border"
                            />
                          </label>
                        </div>
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700">
                              Date of Birth
                            </span>
                            <input
                              type="date"
                              value={details.date_of_birth}
                              name="date_of_birth"
                              onChange={handleOnChange}
                              className="mt-1 block p-1 focus:outline-none w-full border"
                            />
                          </label>
                        </div>
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700 mb-1">
                              Gender
                            </span>
                            <select
                              value={details.gender}
                              name="gender"
                              onChange={handleOnChange}
                              id=""
                              className="border w-full focus:outline-none p-2 pb-1"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </label>
                        </div>
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700 mb-1">
                              Select Type of ID
                            </span>
                            <select
                              value={details.means_of_identification}
                              name="means_of_identification"
                              onChange={handleOnChange}
                              id=""
                              className="border w-full focus:outline-none p-2 pb-1"
                            >
                              <option value="">-- Select --</option>
                              <option value="nin">
                                National Identity Card (NIN)
                              </option>
                              <option value="license">Drivers License </option>
                              <option value="passport">
                                International Passport{" "}
                              </option>
                            </select>
                          </label>
                        </div>

                        {selectId && (
                          <div className="">
                            <label className="block">
                              <span className="block text-sm font-medium text-slate-700">
                                Input {selectId ? selectId : ""} No:
                              </span>
                              <input
                                type="text"
                                value={details.nin}
                                name="nin"
                                onChange={handleOnChange}
                                className="mt-1 block p-1 focus:outline-none w-full border"
                              />
                            </label>
                          </div>
                        )}
                        {selectId && (
                          <div className="">
                            <label className="block">
                              <span className="block text-sm font-medium text-slate-700">
                                Upload {selectId ? selectId : ""} NIN
                              </span>
                              <input
                                type="file"
                                name="nin_slip"
                                onChange={handleOnChange}
                                className="mt-1 block p-1 focus:outline-none w-full border"
                              />
                            </label>
                          </div>
                        )}
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700">
                              Background Image
                            </span>
                            <input
                              type="file"
                              accept=".jpeg, .png, .jpg,"
                              name="background_profile"
                              onChange={handleOnChange}
                              className="mt-1 block p-1 focus:outline-none w-full border"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-b py-6">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="font-medium w-full md:w-2/6 text-slate-900">
                      <p>Professional Details</p>
                    </div>
                    <div className="w-full md:w-4/6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700 mb-1">
                              Educational Qualification
                            </span>
                            <select
                              value={details.educational_qualification}
                              name="educational_qualification"
                              onChange={handleOnChange}
                              id=""
                              className="border w-full focus:outline-none p-2 pb-1"
                            >
                              <option value="">-- select --</option>
                              <option value="ond">OND</option>
                              <option value="hnd">HND</option>
                              <option value="diploma">DILOMA</option>
                              <option value="bsc">Bachelor Degree</option>
                              <option value="msc">Master's Degree</option>
                            </select>
                          </label>
                        </div>
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700 mb-1">
                              Work Experience
                            </span>
                            <input
                              value={details.work_experience}
                              name="work_experience"
                              placeholder="3 years"
                              onChange={handleOnChange}
                              className="border w-full focus:outline-none p-2 pb-1"
                            />
                          </label>
                        </div>
                        <div className="flex flex-col">
                          {/* <label className="block">
                            <span className="block text-sm font-medium text-slate-700 mb-1">
                              {" "}
                              Language{" "}
                            </span>
                            <select
                              multiple
                              value={selectedLanguages}
                              name="languages"
                              onChange={handleOnChange}
                              className="border aria-selected:bg-red-100 w-full focus:outline-none p-2 pb-1"
                            >
                              <option
                                className={
                                  selectedLanguages.find(
                                    (current) => current === "english"
                                  )
                                    ? "bg-black"
                                    : ""
                                }
                                value="english"
                              >
                                English
                              </option>
                              <option value="french">French</option>
                              <option value="hausa">Hausa </option>
                              <option value="Yaruba">Yaruba</option>
                              <option value="igbo">Igbo</option>
                            </select>
                          </label> */}
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700 mb-1">
                              {" "}
                              Language{" "}
                            </span>
                            <div
                              multiple
                              value={selectedLanguages}
                              name="languages"
                              onChange={handleOnChange}
                              className="border grid grid-cols-2 w-full p-2 pb-1"
                            >
                              {[
                                "English",
                                "Hausa",
                                "French",
                                "Yoruba",
                                "igbo",
                              ].map((current) => (
                                <div className="flex items-center gap-1">
                                  {findLanguage(current.toLocaleLowerCase()) ? (
                                    <MdCheckBox
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handleLanguageSelect(
                                          current.toLocaleLowerCase()
                                        )
                                      }
                                    />
                                  ) : (
                                    <MdCheckBoxOutlineBlank
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handleLanguageSelect(
                                          current.toLocaleLowerCase()
                                        )
                                      }
                                    />
                                  )}
                                  {current}
                                </div>
                              ))}
                              {/* <div value="french">French</div>
                              <div value="hausa">Hausa </div>
                              <div value="yaruba">Yaruba</div>
                              <div value="igbo">Igbo</div> */}
                            </div>
                          </label>
                        </div>
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700 mb-1">
                              Salary Type
                            </span>
                            <select
                              value={details.salary_type}
                              name="salary_type"
                              onChange={handleOnChange}
                              className="border w-full focus:outline-none p-2 pb-1"
                            >
                              <option value="">-- select --</option>
                              <option value="annual">Annual</option>
                              <option value="monthly">Monthly</option>
                              <option value="weekly">Weekly</option>
                              <option value="hourly">Hourly</option>
                              <option value="contract">Contract</option>
                            </select>
                          </label>
                        </div>
                        <div className="mb-4">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700">
                              Salary (₦)
                            </span>
                            <input
                              type="numbber"
                              value={details.salary}
                              name="salary"
                              onChange={handleOnChange}
                              className="mt-1 block p-1 focus:outline-none w-full border"
                            />
                          </label>
                        </div>
                        <div className="mb-4">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700">
                              Preferred Job Role
                            </span>
                            <input
                              type="text"
                              value={details.preferred_job_role}
                              name="preferred_job_role"
                              onChange={handleOnChange}
                              className="mt-1 block p-1 focus:outline-none w-full border"
                            />
                          </label>
                        </div>{" "}
                        <div className="mb-4 col-span-2">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700">
                              Personal Profile
                            </span>
                          </label>
                          <textarea
                            value={details.personal_profile}
                            name="personal_profile"
                            onChange={handleOnChange}
                            className="mt-1 min-h-[100px] block w-full focus:outline-green-400 border"
                            id=""
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label>
                      <p className="font-bold mb-5">Experience</p>
                      <TextEditor
                        textValue={details.experience}
                        handleText={handleOutline}
                      />
                    </label>
                  </div>
                  {/* <div className="mb-5">
                                        <label>
                                            <p className="font-bold mb-5">Education</p>
                                            <TextEditor
                                                textValue={details.educational_qualification}
                                                handleText={handleEducation} />
                                        </label>
                                    </div> */}
                </div>
                <div className="w-full border-b mb-8 py-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="font-medium w-full md:w-2/6 text-slate-900">
                      <p>Contact Details</p>
                    </div>
                    <div className="w-full md:w-4/6">
                      <div className="mb-4">
                        <label className="block">
                          <span className="block text-sm font-medium text-slate-700">
                            Contact Address
                          </span>
                          <input
                            type="text"
                            value={details.contact_address}
                            name="contact_address"
                            onChange={handleOnChange}
                            className="mt-1 block p-1 focus:outline-none w-full border"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700 mb-1">
                              Country
                            </span>
                            <select
                              value={details.country}
                              name="country"
                              onChange={handleOnChange}
                              className="border w-full focus:outline-none p-2 pb-1"
                            >
                              <option value="">-- select --</option>
                              {countries.map((country) => (
                                <option
                                selected={country?.name===details?.country}
                                  key={country.isoCode}
                                  value={country.name}
                                >
                                  {country.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700 mb-1">
                              State
                            </span>
                            <select
                              value={details.state}
                              name="state"
                              onChange={handleOnChange}
                              className="border w-full focus:outline-none p-2 pb-1"
                            >
                              <option value="">-- select --</option>

                              {selectStates?.map((each) => (
                                <option  selected={each?.name===details?.state} key={each.isoCode} value={each.name}>
                                  {each.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700 mb-1">
                              Local Governmennt
                            </span>
                            <select
                              value={details.local_gov}
                              name="local_gov"
                              onChange={handleOnChange}
                              className="border w-full focus:outline-none p-2 pb-1"
                            >
                              <option value="">-- select --</option>
                              {selectCity?.map((city) => (
                                <option key={city.isoCode} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div className="mb-4">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700">
                              Address
                            </span>
                            <input
                              type="text"
                              value={details.address}
                              name="address"
                              onChange={handleOnChange}
                              className="mt-1 block p-1 focus:outline-none w-full border"
                            />
                          </label>
                        </div>

                        <div className="col-span-2">
                          <SocialsForm
                            experiences={socialHandles}
                            setExperiences={setSocialHandles}
                          />
                        </div>

                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700">
                              My introduction video
                            </span>
                            <input
                              type="file"
                              accept=".mp4"
                              name="introduction_video"
                              onChange={handleOnChange}
                              placeholder="Jakegyll@gmail.com"
                              className="mt-1 block p-1 focus:outline-none w-full border"
                            />
                          </label>
                        </div>
                        <div className="">
                          <label className="block">
                            <span className="block text-sm font-medium text-slate-700">
                              Password
                            </span>
                            <input
                              type="password"
                              value={details.password}
                              name="password"
                              onChange={handleOnChange}
                              placeholder="Jakegyll@gmail.com"
                              className="mt-1 block p-1 focus:outline-none w-full border"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {errorMsg?.stack && (
                  <div className="py-4 border-b mb-8 text-center">
                    {Object.keys(errorMsg.stack).map((field) => (
                      <div key={field}>
                        {errorMsg.stack[field].map((error, index) => (
                          <p
                            className="text-red-700 text-base font-medium"
                            key={index}
                          >
                            {" "}
                            {error}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {errorMsg?.network && (
                  <div className="py-4 border-b mb-8 text-center">
                    <p className="text-red-700 text-base font-medium">
                      {" "}
                      {errorMsg.network}
                    </p>
                  </div>
                )}
                {/* <div className=" border-b mb-8">
                                    <div className="flex py-6">
                                        <div className=" w-2/5 text-slate-900">
                                            <p className='font-medium'>Account Type</p>
                                            <p>You can update your account type</p>
                                        </div>
                                        <div className="w-3/5 text-slate-700">
                                            <div className="mb-4 flex ">
                                                <div className="mr-4">
                                                    <input type="radio" name="status" id="job_seeker" className='radio' />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="job_seeker" className='font-medium'>Job seeker</label>
                                                    <p>Looking for job</p>
                                                </div>
                                            </div>
                                            <div className="mb-4 flex ">
                                                <div className="mr-4">
                                                    <input type="radio" name="status" id="employer" className='radio' />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="employer" className='font-medium'>Employer</label>
                                                    <p>Hiring, sourcing candidates, or posting a jobs</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                <button className="rounded border prime_bg text-white px-4 flex justify-center py-2 w-[50%]">
                  Save Profile
                  {loading && (
                    <div className="size-[20px] ml-3 animate-spin rounded-full border-r-4  border- "></div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
