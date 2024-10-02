import { useForm } from "react-hook-form";
import FormButton from "../../../components/FormButton";
import { useContext, useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { AuthContext } from "../../../context/AuthContex";
import { axiosClient } from "../../../services/axios-client";
import { FormatError } from "../../../utils/formmaters";
import { onSuccess } from "../../../utils/notifications/OnSuccess";

const formFields = ["house_address", "close_landmark"];

function ResidenceForm() {
  const { authDetails } = useContext(AuthContext);
  const client = axiosClient(authDetails?.token);
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    error: "",
  });

  const submitDetails = async (data) => {
    setLoading(true);
    try {
      const response = await client.post("/domesticStaff/residential-status", {
        ...data,
        state: selectState.name,
        local_gov: selectCity,
        domestic_staff_id: authDetails.user.id,
      });
      console.log("Data", response.data);
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

  useEffect(() => {
    if (error.error && error.message) {
      onFailure(error);
    }
  }, [error.error, error.message]);

  return (
    <div>
      <h1 className="text-xl font-semibold">Residence Details</h1>

      <form
        onSubmit={handleSubmit(submitDetails)}
        className="grid grid-cols-2 gap-x-3 gap-y-5 p-2 w-full text-gray-600"
      >
        <label className="flex flex-col justify-center gap-1">
          <span className="block text-sm font-medium text-slate-700 mb-1">
            Country
          </span>
          <select
            name="country"
            onChange={(e) => {
              const states = State.getStatesOfCountry(e.target.value);
              setSelectStates(states);
              setSelectedCountry(Country.getCountryByCode(e.target.value));
            }}
            className="p-1 border w-full focus:outline-none border-gray-900  rounded-md"
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
          <span className="block text-sm font-medium text-slate-700 mb-1">
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
            className="p-1 border w-full focus:outline-none border-gray-900  rounded-md"
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
          <span className="block text-sm font-medium text-slate-700 mb-1">
            Local Governmennt
          </span>
          <select
            name="local_gov"
            onChange={(e) => {
              setSelectCity(e.target.value);
            }}
            className="p-1 border w-full focus:outline-none border-gray-900  rounded-md"
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
          const labelText = currentKey.replace(/_/g, " ").toUpperCase();

          const inputType = currentKey == "member_since" ? "date" : "text";
          return (
            <div className="flex flex-col gap-1">
              <label>{labelText}</label>
              <input
                className="p-1 border focus:outline-none border-gray-900  rounded-md"
                type={inputType}
                defaultValue={detail}
                {...register(currentKey)}
              />
            </div>
          );
        })}
        <div></div>
        <FormButton loading={loading}>Save Residence Details</FormButton>
      </form>
    </div>
  );
}

export default ResidenceForm;
