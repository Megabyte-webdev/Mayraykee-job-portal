import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Select from 'react-select';
import { countries, currencies } from 'country-data';
import UseAdminManagement from "../../../../hooks/useAdminManagement";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';

console.log(countries)
const uniqueCountries = new Set();

const countryOptions = Object.keys(countries)
  .map((countryCode) => {
    const country = countries[countryCode];

    if (country && country.name && !uniqueCountries.has(country.name)) {
      uniqueCountries.add(country.name);
      return { value: countryCode, label: country.name };
    }

    return null; // Exclude duplicates or invalid data
  })
  .filter((option) => option !== null); // Remove null entries



function AddCurrency() {
  const [countryName, setCountryName] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [flag, setFlag] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { AddFormCurrency } = UseAdminManagement();

  useEffect(() => {
  if (!countryName) {
    setCurrencySymbol("");
    setFlag("");
    return;
  }

  const selectedCountry = countries[countryName];
  if (selectedCountry && selectedCountry.currencies.length > 0) {
    const currencyCode = selectedCountry.currencies[0];
    const currency = currencies[currencyCode];

    setCurrencySymbol(currency ? currency.symbol : "");
    setFlag(selectedCountry.alpha2 ? `https://flagcdn.com/w320/${selectedCountry.alpha2.toLowerCase()}.png` : "");
  } else {
    setCurrencySymbol("");
    setFlag("");
  }
}, [countryName]);


  const convertFlagToFile = async (url) => {
    const response = await axios.get(url, { responseType: 'blob' });
    const file = new File([response.data], 'flag.png', { type: response.data.type });
    console.log("Flag file:", file);
    return file.name;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const flagFile = await convertFlagToFile(flag);

    const formData = new FormData();
    formData.append('name', countryName);
    formData.append('code', currencySymbol);
    // formData.append('image', flagFile);

    console.log("Submitting currency data:", formData);

    try {
      const response = await AddFormCurrency(formData);
      console.log("Response:", response);
      if (response.status !== 500) {
        console.log("Currency Added:", response);
        toast.success("Currency added successfully!");
        setTimeout(() => {
          navigate("/admin/settings/currency");
        }, 2000); // Delay of 2 seconds before navigating
      } else {
        if (response.status === 500 && response.response.data.error.includes("The code has already been taken.")) {
          toast.error("Currency already exists");
        } else {
          toast.error("Failed to add currency");
        }
      }
    } catch (err) {
      toast.error("Failed to add currency"); 
      console.error("Error details:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Currency</title>
      </Helmet>
      <ToastContainer />
      <div className='px-8 py-5'>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 outline outline-offset-5 outline-green-500 px-4 py-2 rounded text-green-500 hover:bg-green-100"
        >
          <FaArrowLeftLong className="me-4 text-green-500" />Back
        </button>
      </div>
      <div className="h-full p-6 w-full text-sm text-gray-800 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="space-y-4 shadow-lg p-6 rounded-md bg-white w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Add New Currency</h2>
          {error && <div className="text-red-600">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Country Name</label>
            <Select
              options={countryOptions}
              value={countryOptions.find(option => option.value === countryName)}
              onChange={(option) => setCountryName(option?.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency Symbol</label>
            <input
              type="text"
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Flag</label>
            <img src={flag} alt="Country Flag" className="mt-1 block w-8 h-8 object-contain rounded-full" />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            <FaPlus className="mr-2" />
            {loading ? 'Adding...' : 'Add Currency'}
          </button>
        </form>
      </div>
    </>
  );
}

export default AddCurrency;