import { useForm } from "react-hook-form";
import { FormatError, FormatPrice } from "../../../utils/formmaters";
import FormButton from "../../../components/FormButton";
import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../../../services/axios-client";
import { AuthContext } from "../../../context/AuthContex";
import { StaffManagementContext } from "../../../context/StaffManagementModule";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { FaExclamationCircle } from "react-icons/fa";
import {
  MdAdd,
  MdAddCircle,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdClose,
} from "react-icons/md";
import PopUpBox from "../../../components/PopUpBox";
import { ImUpload2 } from "react-icons/im";
import { options } from "less";
import { ethnicGroups } from "../../../utils/constants";

const PROFILE_DETAILS_KEY = "Staff Profile Detaials Database";

const field_sections = {
  primary: [
    {
      name: "First Name",
      type: "text",
      field_name: "first_name",
    },
    {
      name: "Surname",
      type: "text",
      field_name: "surname",
    },
    {
      name: "Middle name",
      type: "text",
      field_name: "middle_name",
    },
    {
      name: "Email",
      type: "email",
      field_name: "email",
    },
    {
      name: "Age",
      type: "number",
      field_name: "age",
    },
    {
      name: "Gender",
      type: "select",
      options: ["Male", "Female"],
      field_name: "gender",
    },
    {
      name: "Religion",
      type: "select",
      options: [
        "Christianity",
        "Islam",
        "Traditional"
      ],
      field_name: "religion",
    },
    {
      name: "Ethnicity",
      type: "select",
      options: [...ethnicGroups],
      field_name: "ethnicity",
    },
    {
      name: "Location",
      type: "text",
      field_name: "location",
    },
  ],

  professional: [
    {
      name: "Employment Type",
      type: "select",
      options: ["Full Time", "Part Time"],
      field_name: "employment_type",
    },
    {
      name: "Work Type",
      type: "select",
      options: ["Live Out", "Live In"],
      field_name: "work_type",
    },
    {
      name: "Work Days",
      type: "select",
      options: [
        "1 Day",
        "2 Days",
        "3 Days",
        "4 Days",
        "5 Days",
        "6 Days",
        "7 Days",
      ],
      field_name: "work_days",
    },
    {
      name: "Rumuneration",
      type: "select",
      options: ["Daily Pay", "Weekly Pay", "Bi-Weekly Pay", "Monthly Pay"],
      field_name: "rumuneration",
    },
    {
      name: "Current Salary",
      type: "number",
      field_name: "current_salary",
    },
    {
      name: "Expected Salary",
      type: "number",
      field_name: "expected_salary",
    },
    {
      name: "Years Of Experience",
      type: "number",
      field_name: "years_of_experience",
    },

    {
      name: "Education Level",
      type: "select",
      options: [
        "Primary School Certificate",
        "Secondary School Certificate",
        "Diploma",
        "Degree",
        "None",
      ],
      field_name: "education_level",
    },
  ],
  secondary: [
    {
      name: "Marital Status",
      type: "select",
      options: ["Single", "Married", "Divorced", "Widowed"],
      field_name: "marital_status",
    },
    // {
    //   name: "Date I Joined Mayrahkee",
    //   type: "date",
    //   field_name: "member_since",
    // },
  ],
};

const fields = [];

function ProfileForm({ setToMain }) {
  const { authDetails } = useContext(AuthContext);
  const { profileDetails, getStaffProfile } = useContext(
    StaffManagementContext
  );
  // Initialize selectedLanguages with an empty array if languages_spoken is undefined
  const [selectedLanguages, setSelectedLanguages] = useState(
    profileDetails?.languages_spoken || []
  );

  const client = axiosClient(authDetails?.token, true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    error: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [otherLanguage, setOtherLanguage] = useState("");
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState();

  const onSubmit = async (data) => {

    if (!file && profileDetails?.profile_image == null) {
      onFailure({
        error: "Profile Image Required",
        message: "Please upload a profile image before submitting.",
      });
      return
    }
    setLoading(true);
    // Filter out placeholder values from select fields
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value && value !== `-- Select ${key} --`
      )
    );

    try {
      const response = await client.post(
        `/domesticStaff/update-profile/${authDetails.user.id}`,
        {
          ...filteredData,
          languages_spoken: selectedLanguages,
          profile_image: file,
          job_type: "something",
        }
      );
      getStaffProfile();
      onSuccess({
        message: "Profile Success",
        success: "Profile Info updated successfully",
      });
      setToMain();
    } catch (error) {
      onFailure({
        error: "Failed to update",
        message: "Something went wrong",
      });
      setLoading(false);
    }

  };

  // Guard clause to prevent rendering before profileDetails is loaded
  if (!profileDetails) return null;

  const filterProfileDetails = profileDetails
    ? Object.keys(profileDetails)?.filter(
      (currentKey) =>
        currentKey !== "created_at" &&
        currentKey !== "updated_at" &&
        currentKey !== "id" &&
        currentKey !== "staff_category" &&
        currentKey !== "staff_category" &&
        currentKey !== "guarantor_verification_status" &&
        currentKey !== "residence_verification_status" &&
        currentKey !== "medical_history_verification_status" &&
        currentKey !== "police_report_verification_status" &&
        currentKey !== "previous_employer_verification_status" &&
        currentKey !== "family_verification_status" &&
        currentKey !== "contact_information" &&
        currentKey !== "subcategory" &&
        currentKey !== "resume" &&
        currentKey !== "availability_status" &&
        currentKey !== "employment_type"
    )
    : [];

  const toogleIsOpen = () => setIsOpen(!isOpen);

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];

    if (imageFile) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(imageFile.type)) {
        onFailure({
          error: "File Type Error",
          message: "Only JPG and PNG images are allowed.",
        });
        return ;
      }

      // Validate file size (should not exceed 1MB)
      if (imageFile.size > 1024 * 1024) { // 1MB limit
        alert("File size should not exceed 1MB.");
        onFailure({
          error: "File Size Error",
          message: "File size should not exceed 1MB.",
        });
        return;
      }

      setFile(imageFile);
      const url = URL.createObjectURL(imageFile);
      console.log("url", url);
      setImageUrl(url);
    }
  };



  return (
    <>
      <PopUpBox isOpen={isOpen}>
        <div className="w-[300px] p-3 gap-3 rounded-lg  flex flex-col bg-white">
          <MdClose
            onClick={toogleIsOpen}
            className="place-self-end text-lg cursor-pointer"
          />
          <label className="text-sm font-semibold">Add Langauge</label>
          <input
            value={otherLanguage}
            onChange={(e) => setOtherLanguage(e.target.value)}
            className="p-2 border focus:outline-none"
            placeholder="Enter language..."
          />

          <FormButton
            onClick={() => {
              if (otherLanguage) {
                setSelectedLanguages([...selectedLanguages, otherLanguage]);
                toogleIsOpen();
              } else {
                onFailure({
                  error: "Input Error",
                  message: "Please enter a value",
                });
              }
              setOtherLanguage("za");
            }}
          >
            Add Language
          </FormButton>
        </div>
      </PopUpBox>

      <div className="w-full flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Update Your Profile</h1>

        <div className="flex flex-col gap-2 bg-green-100 pr-5 p-2 w-fit">
          <div className="flex w-full justify-between items-center">
            <span className="flex gap-2 uppercase items-center text-green-700">
              Important Note <FaExclamationCircle />
            </span>

            <button className=" group hover:bg-red-500 hover:text-white p-1 text-red-600 text-md flex justify-between items-center ">
              Close
              <MdClose className="" />
            </button>
          </div>

          <p>
            All details below are required to be filled. Our algorithms
            automatically hides users who's profile have not been updated, this
            means you will go unnoticed with an incomplete profile
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-x-3 gap-y-5 p-2 w-full text-gray-600"
        >
          {filterProfileDetails ? (
            <>
              <div className="flex flex-col gap-5 border-b pb-4">
                <h3 className="font-semibold text-lg">Primary Information</h3>
                <div className="h-[100px] flex items-center overflow-hidden justify-center text-gray-500 border border-[#dee2e6] w-[100px] rounded-full">
                  {imageUrl ? (
                    <>
                      <label
                        htmlFor="profile-image"
                        className="flex flex-col cursor-pointer items-center justify-center"
                      >
                        <span className="text-[12px]">Upload pic</span>
                        <img src={imageUrl} className="h-full " />
                      </label>
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        id="profile-image"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                    </>
                  ) : (
                    <div>
                      {" "}
                      <label
                        htmlFor="profile-image"
                        className="flex flex-col cursor-pointer items-center justify-center"
                      >
                        <ImUpload2 size={20} />
                        <span className="text-[12px]">Upload pic</span>
                      </label>
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        id="profile-image"
                        onChange={(e) => handleImageChange(e)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                <small className="-mt-4 text-xs text-gray-500">
                  File size should not exceed 1MB. </small>
                <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                  {field_sections.primary?.map((currentKey) => {
                    const detail = profileDetails[currentKey.field_name];
                    // const labelText = currentKey.replace(/_/g, " ").toUpperCase();

                    const inputType =
                      currentKey == "member_since" ? "date" : currentKey?.type;
                    return (
                      <div className="flex flex-col gap-1">
                        <label>
                          {currentKey.name}
                          <span className="text-red-500 ml-1 ">*</span>
                        </label>
                        {currentKey.type !== "select" ? (
                          <input
                            required
                            className="p-1 border focus:outline-none border-gray-900  rounded-md"
                            type={inputType}
                            defaultValue={detail}
                            {...register(currentKey.field_name)}
                          />
                        ) : (
                          <select
                            required
                            className="p-1 border focus:outline-none border-gray-900  rounded-md"
                            type={inputType}
                            defaultValue={detail}
                            {...register(currentKey.field_name)}
                          >
                            <option disabled value="">
                              -- Select {currentKey.name} --
                            </option>
                            {currentKey.options.map((current) => (
                              <option>{current}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-5 border-b pb-4">
                <h3 className="font-semibold text-lg">
                  Professional Information
                </h3>
                <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                  {field_sections.professional.map((currentKey, index) => {
                    const detail = profileDetails[currentKey.field_name];
                    const inputType =
                      currentKey.field_name === "member_since"
                        ? "date"
                        : "text";
                    return (
                      <div className="flex flex-col gap-1" key={index}>
                        <label>
                          {currentKey.name}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        {currentKey.type !== "select" ? (
                          currentKey.type === "number" ? (
                            <input
                              className="p-1 border focus:outline-none border-gray-900 rounded-md"
                              type="number"
                              defaultValue={detail}
                              {...register(currentKey.field_name)}
                            />
                          ) : (
                            <input
                              className="p-1 border focus:outline-none border-gray-900 rounded-md"
                              type={inputType}
                              defaultValue={detail}
                              {...register(currentKey.field_name)}
                            />
                          )
                        ) : (
                          <select
                            className="p-1 border focus:outline-none border-gray-900 rounded-md"
                            defaultValue={detail}
                            {...register(currentKey.field_name)}
                          >
                            <option disabled value="">
                              -- Select {currentKey.name} --
                            </option>
                            {currentKey.options &&
                              currentKey.options.map((current, optionIndex) => (
                                <option key={optionIndex} value={current}>
                                  {current}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex flex-col gap-2 pl-2">
                    <label>
                      Languages Spoken
                      <span className="text-red-500 ml-1 ">*</span>
                    </label>
                    <div className="flex flex-col">
                      <div className="flex flex-wrap w-full justify-start gap-3">
                        {[
                          "English",
                          "Hausa",
                          "Igbo",
                          "Yoruba",
                          "Pidgin",
                          "Others",
                        ].map((current) => {
                          let index;
                          const isSelected = selectedLanguages?.find(
                            (currentSelected, i) => {
                              index = i;
                              return current == currentSelected;
                            }
                          );
                          return (
                            <div className="text-lg cursor-pointer flex items-center w-fit">
                              {isSelected && current !== "Others" ? (
                                <MdCheckBox
                                  onClick={() => {
                                    if (current !== "Others") {
                                      setSelectedLanguages((prev) => {
                                        const newList = [...prev];
                                        const filtered = newList.filter(
                                          (currentSelected) =>
                                            currentSelected != current
                                        );

                                        return filtered;
                                      });
                                    }
                                  }}
                                />
                              ) : !isSelected && current !== "Others" ? (
                                <MdCheckBoxOutlineBlank
                                  onClick={() => {
                                    if (current !== "Others") {
                                      setSelectedLanguages([
                                        ...selectedLanguages,
                                        current,
                                      ]);
                                    }
                                  }}
                                />
                              ) : (
                                <MdAddCircle onClick={toogleIsOpen} />
                              )}
                              <span>{current}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap w-full justify-start gap-3">
                        {selectedLanguages
                          .filter((current) => {
                            const found = [
                              "English",
                              "Hausa",
                              "Igbo",
                              "Yoruba",
                              "Pidgin",
                              "Others",
                            ].find((currentOne) => currentOne === current);

                            if (found) {
                              return false;
                            } else {
                              return true;
                            }
                          })
                          .map((current, idx) => {
                            let index;
                            const isSelected = selectedLanguages?.find(
                              (currentSelected, i) => {
                                index = i;
                                return current == currentSelected;
                              }
                            );
                            return (
                              <div
                                key={idx}
                                className="text-lg cursor-pointer flex items-center w-fit"
                              >
                                <MdCheckBox
                                  onClick={() => {
                                    if (current !== "Others") {
                                      setSelectedLanguages((prev) => {
                                        const newList = [...prev];
                                        const filtered = newList.filter(
                                          (currentSelected) =>
                                            currentSelected != current
                                        );

                                        return filtered;
                                      });
                                    }
                                  }}
                                />

                                <span>{current}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5 border-b pb-4">
                <h3 className="font-semibold text-lg">Secondary Information</h3>
                <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                  {field_sections.secondary.map((currentKey, index) => {
                    const detail = profileDetails[currentKey.field_name];
                    // const labelText = currentKey.replace(/_/g, " ").toUpperCase();

                    return (
                      <div key={index} className="flex flex-col gap-1">
                        <label>
                          {currentKey.name}
                          <span className="text-red-500 ml-1 ">*</span>
                        </label>
                        {currentKey.type !== "select" ? (
                          <input
                            className="p-1 border focus:outline-none border-gray-900  rounded-md"
                            type={currentKey.type}
                            defaultValue={detail}
                            {...register(currentKey.field_name)}
                          />
                        ) : (
                          <select
                            className="p-1 border focus:outline-none border-gray-900  rounded-md"
                            defaultValue={detail}
                            {...register(currentKey.field_name)}
                          >
                            <option disabled value="">
                              -- Select {currentKey.name} --
                            </option>
                            {currentKey.options.map((current) => (
                              <option>{current}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <FormButton loading={loading}>Update Profile</FormButton>
            </>
          ) : (
            <span>Loading Data</span>
          )}
        </form>
      </div>
    </>
  );
}

export default ProfileForm;
