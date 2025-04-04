import { useForm } from "react-hook-form";
import FormButton from "../../../components/FormButton";
import { useContext, useEffect, useState } from "react";
import { axiosClient } from "../../../services/axios-client";
import { AuthContext } from "../../../context/AuthContex";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { FormatError } from "../../../utils/formmaters";
import ConfirmationPopUp from "./ConfirmationPopUp"; // Import the popup

const formFields = [
  "company_name",
  "job_title",
  "start_date",
  "end_date",
  "work_description",
  "reason_for_leaving",
];

function WorkExperience() {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    error: "",
  });
  const [workExperiences, setWorkExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const submitDetails = async (data) => {
    setIsLoading(true);
    try {
      const response = await client.post(
        "/domesticStaff/previous-work-experience",
        {
          ...data,
          domestic_staff_id: authDetails.user.id,
        }
      );
      getWorkExperiences();
      reset();
      onSuccess({
        message: "Experience Saved!",
        success: "Submitted succesfully, awaiting review",
      });
    } catch (error) {
      FormatError(error, setError, "Upload Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = () => {
    setIsPopupOpen(false);
    handleSubmit(submitDetails)(); // Proceed with form submission
  };


  const getWorkExperiences = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(
        `/domesticStaff/previous-work-experience/${authDetails.user.id}`
      );
      setWorkExperiences(data.PreviousWorkExperience);
    } catch (error) {
      FormatError(error, setError, "Retrieval Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkExperiences();
  }, []);

  useEffect(() => {
    if (error.error && error.message) {
      onFailure(error);
    }
  }, [error.error, error.message]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-green-700">Previous Work Experience</h1>

      {
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsPopupOpen(true);
          }}
          className="grid grid-cols-2 gap-x-3 gap-y-5 p-2 w-full text-gray-600"
        >
          {formFields.map((currentKey) => {
            const detail = formFields[currentKey];
            let labelText;

            if (currentKey === "company_name") {
              labelText = currentKey.replace(/_/g, " ") + ' / Employer\'s Name';
            } else {
              labelText = currentKey.replace(/_/g, " ");
            }

            const inputType =
              currentKey == "start_date" || currentKey == "end_date"
                ? "date"
                : "text";
            return (
              <div className="flex flex-col gap-1">
                <label className="capitalize font-medium">{labelText}</label>
                <input
                  className="p-1 border focus:outline-none border-gray-900  rounded-md"
                  type={inputType}
                  required
                  defaultValue={detail}
                  {...register(currentKey)}
                />
              </div>
            );
          })}

          <FormButton loading={isLoading}>Save Work Experience</FormButton>
        </form>
      }

      {typeof workExperiences == "undefined" && loading && (
        <div className="flex flex-col items-start justify-center h-full w-full">
          <span>Fetching data...</span>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div className="flex justify-between flex-col mt-5">
          {workExperiences?.map((current, index) => (
            <div className="flex flex-col gap-x-3 border-b gap-y-5 p-2 w-full text-gray-600">
              <div className="flex flex-col gap-1">
                <label className="gap-3 font-semibold text-lg">
                  ({index + 1}) Work Description
                </label>
                <label className="pl-6 capitalize font-medium">{current["work_description"]}</label>
              </div>
              <div className="flex flex-col gap-1">
                <label className="gap-3 font-semibold text-lg pl-6">
                  Reason for Leaving Previous Job
                </label>
                <label className="pl-6 capitalize">{current["reason_for_leaving"]}</label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Popup */}
      <ConfirmationPopUp
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onConfirm={handleProceed}
        message="Ensure your details are correct before proceeding. If you need to make changes later, contact the admin."
      />
    </div>
  );
}

export default WorkExperience;
