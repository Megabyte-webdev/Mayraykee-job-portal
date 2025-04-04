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
  "surname",
  "first_name",
  "mobile_phone",
  "dob",
  "email",
  "occupation",
  "residential_address",
  "near_bus_stop",
  "close_landmark",
];

const labelMapping = {
  surname: "Surname",
  first_name: "First Name",
  mobile_phone: "Mobile Phone",
  dob: "Date of Birth",
  religion:"Religion",
  email: "Email",
  occupation: "Occupation",
  residential_address: "Residential Address",
  near_bus_stop: "Nearest Bus Stop",
  close_landmark: "Closest Landmark",
};

function GuarantorForm() {
  const { authDetails } = useContext(AuthContext);
  const [currentGurantor, setCurrentGarantor] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const client = axiosClient(authDetails?.token);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    error: "",
  });

  const submitDetails = async (data) => {
    setIsLoading(true);
    try {
      const response = await client.post("/domesticStaff/guarantor", {
        ...data,
        domestic_staff_id: authDetails.user.id,
      });
      console.log("Data", response.data);
      getGarantor();
      onSuccess({
        message: "Guarantor Saved",
        success: "Submitted successfully, awaiting review",
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

  const guarantorFields = () => {
    const fields = [];
    Object.keys(currentGurantor)?.forEach((current) => {
      if (
        current !== "id" &&
        current !== "domestic_staff_id" &&
        current !== "created_at" &&
        current !== "updated_at"
      ) {
        fields.push(current);
      }
    });
    return fields;
  };

  const getGarantor = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(`/domesticStaff/guarantor/${authDetails.user.id}`);
      setCurrentGarantor(data.guarantor[0]);
    } catch (error) {
      FormatError(error, setError, "Retrieval Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGarantor();
  }, []);

  useEffect(() => {
    if (error.error && error.message) {
      onFailure(error);
    }
  }, [error.error, error.message]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-green-700">Guarantor Details</h1>
      {typeof currentGurantor === "undefined" && loading && (
        <div className="flex flex-col items-start justify-center h-full w-full">
          <span>Fetching data...</span>
        </div>
      )}

      {typeof currentGurantor !== "undefined" && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 p-2 w-full text-gray-600">
          {guarantorFields()?.map((currentKey) => {
            const value = currentGurantor[currentKey];
            const labelText = labelMapping[currentKey] || null;

            return (
              labelText &&
              <div className="flex flex-col gap-1 break-all" key={currentKey}>
                <label className="capitalize font-medium" >{labelText}</label>
                <label>{currentKey === "dob" ? value?.split("-").reverse().join("-") :value}</label>
              </div>
            );
          })}
        </div>
      )}

      {typeof currentGurantor === "undefined" && !loading && (
        <form
           onSubmit={(e) => {
            e.preventDefault();
            setIsPopupOpen(true);
          }}
          className="grid grid-cols-2 gap-x-3 gap-y-5 p-2 w-full text-gray-600"
        >
          <div className="flex flex-col gap-1">
            <label className="capitalize font-medium">Title</label>
            <select
              className="p-1 border focus:outline-none border-gray-500 rounded-md"
              required
              {...register("title")}
            >
              <option>MR</option>
              <option>MRS</option>
              <option>Others</option>
            </select>
          </div>

          {formFields.map((currentKey) => {
            const labelText = labelMapping[currentKey] || currentKey.replace(/_/g, " ");
            const inputType = currentKey === "dob" ? "date" : "text";

            return (
              <div className="flex flex-col gap-1" key={currentKey}>
                <label className="capitalize font-medium">{labelText}</label>
                <input
                  className="p-1 border focus:outline-none border-gray-500 rounded-md"
                  type={inputType}
                  required
                  {...register(currentKey)}
                />
              </div>
            );
          })}

          <div className="flex flex-col gap-1">
            <label className="font-medium">Religion</label>
            <select
              required
              className="p-1 border focus:outline-none border-gray-500 rounded-md"
              {...register("religion")}
            >
              <option>Christianity</option>
              <option>Islam</option>
              <option>Traditional</option>
              {/* <option>Hinduism</option>
              <option>Buddhism</option>
              <option>Sikhism</option>
              <option>Judaism</option>
              <option>Baha'i</option>
              <option>Others</option> */}
            </select>
          </div>

          <div></div>
          <FormButton loading={isLoading}>Save Guarantor Details</FormButton>
        </form>
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

export default GuarantorForm;
            
