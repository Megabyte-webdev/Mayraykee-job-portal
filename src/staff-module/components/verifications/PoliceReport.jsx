import { useForm } from "react-hook-form";
import FormButton from "../../../components/FormButton";
import { useContext, useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { AuthContext } from "../../../context/AuthContex";
import { axiosClient, resourceUrl } from "../../../services/axios-client";
import { FormatError, getImageURL } from "../../../utils/formmaters";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { onFailure } from "../../../utils/notifications/OnFailure";

const formFields = ["station_address"];

function PoliceReport() {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token, true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState();
  const [selectStates, setSelectStates] = useState();
  const [selectState, setSelectState] = useState();
  const [selectCity, setSelectCity] = useState();
  const [selectCities, setSelectCities] = useState();
  const [file, setFile] = useState();
  const [error, setError] = useState({
    message: "",
    error: "",
  });
  const [isloading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState();

  const submitDetails = async (data) => {
    setLoading(true);
    try {
      const response = await client.post("/domesticStaff/police-report", {
        ...data,
        state: selectState.name,
        lga: selectCity,
        police_report_file: file,
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
      setLoading(false);
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
        `/domesticStaff/police-report/${authDetails.user.id}`
      );

      setCurrentRecord(data.PoliceReport[0]);
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
      <h1 className="text-xl font-semibold text-green-700">Police Report</h1>

      {typeof currentRecord == "undefined" && loading && (
        <div className="flex flex-col items-start justify-center h-full w-full">
          <span>Fetching data...</span>
        </div>
      )}

      {typeof currentRecord !== "undefined" && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 p-2 w-full text-gray-600">
          {recordFields()?.map((currentKey) => {
            const value = currentRecord[currentKey];
            const labelText = currentKey.replace(/_/g, " ");

            return (
              <div className="flex flex-col gap-1">
                <label className="capitalize font-medium">{labelText}</label>
                {currentKey == "police_report_file" ? (
                  <a
                    className="text-blue-300 underline"
                    href={`${resourceUrl}${value}`}
                  >
                    Document link
                  </a>
                ) : (
                  <label>{value}</label>
                )}{" "}
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
          <label className="flex flex-col justify-center gap-1">
            <span className="block font-medium text-slate-700 mb-1">
              Country
            </span>
            <select
              name="country"
              onChange={(e) => {
                const states = State.getStatesOfCountry(e.target.value);
                setSelectStates(states);
                setSelectedCountry(Country.getCountryByCode(e.target.value));
              }}
              className="p-1 border w-full focus:outline-none border-gray-500 text-sm rounded-md"
            >
              <option value="">-- select --</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col justify-center gap-1">
            <span className="block font-medium text-slate-700 mb-1">
              State
            </span>
            <select
              name="state"
              onChange={(e) => {
                const cities = City.getCitiesOfState(
                  selectedCountry.isoCode,
                  e.target.value
                );
                console.log(cities);
                setSelectState(State.getStateByCode(e.target.value));
                setSelectCities(cities);
              }}
              className="p-1 border w-full focus:outline-none text-sm border-gray-500  rounded-md"
            >
              <option value="">-- select --</option>
              {selectStates?.map((each) => (
                <option key={each.name} value={each.isoCode}>
                  {each.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col justify-center gap-1">
            <span className="block font-medium text-slate-700 mb-1">
              Local Governmennt
            </span>
            <select
              onChange={(e) => {
                setSelectCity(e.target.value);
              }}
              name="local_gov"
              className="p-1 border w-full focus:outline-none border-gray-500 text-sm rounded-md"
            >
              <option value="">-- select --</option>
              {selectCities?.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>

          {formFields.map((currentKey) => {
            const detail = formFields[currentKey];
            const labelText = currentKey.replace(/_/g, " ");

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
            <label className="font-medium">Upload Report</label>
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                setFile(file);
              }}
              className="p-1 border focus:outline-none border-gray-500  rounded-md"
              type="file"
              accept=".pdf, .doc, .jpeg, .jpg"
            />
          </div>
          <div></div>
          <FormButton loading={isloading}>Upload Police Records</FormButton>
        </form>
      )}
    </div>
  );
}

export default PoliceReport;
