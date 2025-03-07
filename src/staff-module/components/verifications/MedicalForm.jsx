import { useForm } from "react-hook-form";
import FormButton from "../../../components/FormButton";
import { useContext, useEffect, useState } from "react";
import { FaRegFileLines } from "react-icons/fa6";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { FormatError } from "../../../utils/formmaters";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { AuthContext } from "../../../context/AuthContex";
import { axiosClient, resourceUrl } from "../../../services/axios-client";
import { toast } from "react-toastify";

const formFields = ["hospital_name", "contact_detail"];

function MedicalForm() {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token, true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [currentRecord, setCurrentRecord] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    error: "",
  });

  const [medicalFiles, setMedicalFiles] = useState([]);

  const getMedicalRecords = (e) => {
    const { name } = e.target;
    const file = e.target.files[0]; //filelist is an object carrying all details of file, .files[0] collects the value from key 0 (not array), and stores it in file
    if (file && (file.size > (1024 * 1024))) {
      const maxSizeMB = ((1024 * 1024) / (1024 * 1024)).toFixed(2); // Convert file size limit to MB
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2); // Convert uploaded file size to MB
      e.target.value=null;
      // Truncate long file names to 20 characters for better UI readability
      const truncatedFileName = file.name.length > 10 ? `${file.name.substring(0, 10)}...` : file.name;
      toast.error(`File size of "${truncatedFileName}" exceeds the limit of ${maxSizeMB} MB. The uploaded file is ${fileSizeMB} MB. Please select a smaller file.`);
      return null;
    }
    if (
      file &&
      [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
      ].includes(file.type)
    ) {
      // You can also perform additional actions with the valid file
      const generatedUrl = URL.createObjectURL(file);
      const list = [...medicalFiles, { file: file }];

      // const files = list.map((current) => current.file);
      setMedicalFiles(list);
    } else {
      // Handle invalid file type
      alert("Please select a valid JPEG or PNG file.");
    }
  };

  const submitDetails = async (data) => {
    console.log(medicalFiles[0]);
    setIsLoading(true);
    try {
      const response = await client.post("/domesticStaff/medical-history", {
        ...data,
        medical_report_docs: medicalFiles[0].file,
        domestic_staff_id: authDetails.user.id,
      });
      console.log("Data", response.data);
      getCurrentRecord();
      onSuccess({
        message: "Residence info uploaded",
        success: "Submitted succesfully, awaiting review",
      });
    } catch (error) {
      FormatError(error, setError, "Upload Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const recordFields = () => {
    const fields = [];
    Object.keys(currentRecord)?.map((current) => {
      if (
        current !== "id" &&
        current !== "domestic_staff_id" &&
        current !== "created_at" &&
        current !== "updated_at"
      ) {
        fields.push(current);
        return;
      }
    });

    return fields;
  };

  const getCurrentRecord = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(
        `/domesticStaff/medical-history/${authDetails.user.id}`
      );
      setCurrentRecord(data.MedicalHistory[0]);
    } catch (error) {
      FormatError(error, setError, "Retrieval Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentRecord();
  }, []);

  useEffect(() => {
    if (error.error && error.message) {
      onFailure(error);
    }
  }, [error.error, error.message]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-green-700">Medical Reports</h1>

      {typeof currentRecord == "undefined" && loading && (
        <div className="flex flex-col items-start justify-center h-full w-full">
          <span>Fetching data...</span>
        </div>
      )}

      {typeof currentRecord !== "undefined" && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 p-2 w-full text-gray-600">
          {recordFields()?.map((currentKey) => {
            const value = currentRecord[currentKey];
            let labelText;

            if (currentKey === "contact_detail") {
              labelText = "Contact Number";
            } else {
              labelText = currentKey.replace(/_/g, " ");
            }
            return (
              <div className="flex flex-col gap-1">
                <label className="capitalize font-medium">{labelText}</label>
                {currentKey == "medical_report_docs" ? (
                  <a
                    className="text-blue-300 underline"
                    href={`${resourceUrl}${value}`}
                  >
                    Document link
                  </a>
                ) : (
                  <label>{value}</label>
                )}
              </div>
            );
          })}
        </div>
      )}

      {typeof currentRecord === "undefined" && !loading && (
        <form
          onSubmit={handleSubmit(submitDetails)}
          className="grid grid-cols-2 gap-x-3 gap-y-5 p-2 w-full text-gray-600"
        >
          {formFields.map((currentKey) => {
            const detail = formFields[currentKey];
            let labelText;

            if (currentKey === "contact_detail") {
              labelText = "Contact Number";
            } else {
              labelText = currentKey.replace(/_/g, " ");
            }
            const inputType = currentKey == "member_since" ? "date" : "text";
            return (
              <div className="flex flex-col gap-1">
                <label className="capitalize font-medium">{labelText}</label>
                <input
                  className="p-1 border focus:outline-none border-gray-500  rounded-md"
                  type={inputType}
                  defaultValue={detail}
                  {...register(currentKey)}
                />
              </div>
            );
          })}
          <div className="flex flex-col gap-1">
            <label className="capitalize font-medium">Add File</label>
            <input
              className="p-1 border focus:outline-none border-gray-500  rounded-md"
              type="file"
              accept=".pdf, .doc, .jpeg, .jpg"
              onChange={getMedicalRecords}
            />
             <small class="px-2 mb-2 text-XS text-gray-500 font-medium">File size should not exceed 1MB. Only accepts *.pdf, .doc, .jpeg,..*</small>
          </div>

          <div></div>
          <div className="h-[150px] grid grid-cols-5 border border-dashed p-3">
            {medicalFiles?.map((current) => (
              <div className="p-1">
                <FaRegFileLines className="text-3xl" />
                <span className="truncate block ">{current?.file?.name}</span>
              </div>
            ))}
          </div>
          <div></div>
          <FormButton loading={isloading}>Upload Medical Details</FormButton>
        </form>
      )}
    </div>
  );
}

export default MedicalForm;
