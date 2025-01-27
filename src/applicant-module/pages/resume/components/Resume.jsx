import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditResume from "./EditResume";
import { BASE_URL, IMAGE_URL } from "../../../../utils/base";
import axios from "axios";
import { onSuccess } from "../../../../utils/notifications/OnSuccess";

const Resume = ({ resume, setGetResumeById, authDetails, getCandidate }) => {
  const [errorMsg, setErrorMsg] = useState(false);
  const [loading, setLoading] = useState(null);

  const deleteUser = (e) => {
    setErrorMsg(null);
    setLoading(true);
    setGetResumeById((prev) => {
      return {
        ...prev,
        isDataNeeded: false,
      };
    });
    axios
      .delete(`${BASE_URL}/resumes/${resume.id}`, {
        headers: {
          Authorization: `Bearer ${authDetails.token}`,
          // 'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response);
        setLoading(false);
        setGetResumeById((prev) => {
          return {
            ...prev,
            isDataNeeded: true,
          };
        });
        onSuccess({
          message: "Delete Resume",
          success: response.data.message,
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setErrorMsg(error.response.data.error);
        } else {
          console.log(error);
          setErrorMsg(error.message);
        }
        setLoading(false);
      });
  };
  console.log(resume);
  console.log(getCandidate);
  return (
    <div className="p-5 border rounded shadow-lg justify-between flex-col flex">
      <div>
        <div className="flex border-b justify-between font-semibold text-primaryColor items-center w-full">
          <p className="capitalize truncate" >{resume.title}</p>
          <EditResume resume={resume} />
        </div>
        <div className="details mt-4">
          <div className="flex justify-center mb-3">
            <div className="md:w-50">
              <h3 className="font-bold">{getCandidate.details?.full_name}</h3>
            </div>
          </div>
          <div className="details flex justify-center">
            <div className="md:w-[90%] flex flex-col gap-3">
              <div className="flex justify-between gap-2">
                <p className="font-bold">Address:</p>
                <p>{getCandidate.details?.address}</p>
              </div>
              <div className="flex justify-between gap-2">
                <p className="font-bold">Phone: </p>
                <p> {getCandidate.details?.phone_number} </p>
              </div>
              <div className="flex justify-between gap-2">
                <p className="font-bold text-base">Email</p>
                <p className="font-medium">{getCandidate.details?.email}</p>
              </div>

              <div className="flex justify-between gap-2">
                <p className="font-medium text-base">Position</p>
                <p className="">{resume.position_held}</p>
              </div>
              
              {resume.awarding_institution && <div className="flex justify-between text-[#dbc87c]">
                <p className="font-bold text-base">Awarding Institution</p>
                <p className="font-medium">{resume.awarding_institution}</p>
              </div>}
              <div className="flex justify-between gap-2">
                <p className="font-medium text-base">Duration</p>
                <p>
                  <span>{resume.start_date}</span> to{" "}
                  <span>{resume.end_date}</span>
                </p>
              </div>
              <div className="flex my-3">
                <div className="w-2/5">
                  <p className="font-bold text-base">Education</p>
                </div>
                <div className="w-3/5">
                  <p className="font-medium">
                    {resume.educational_institution}
                  </p>
                  <p>
                    <span>{resume.year_of_entry}</span> -{" "}
                    <span>{resume.year_of_graduation}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full">
        {errorMsg && (
          <div className="flex justify-center my-3">
            <small className="text-red-700 text-center">{errorMsg}</small>
          </div>
        )}
        <div className="flex justify-center mt-3">
          <button
            onClick={deleteUser}
            className="px-8 py-2 rounded bg-red-500 text-white"
            disabled={loading}
          >
            {loading ? "Deleting" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;
