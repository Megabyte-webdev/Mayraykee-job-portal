import React, { useContext, useEffect, useState } from 'react'
import { TbPhoto } from 'react-icons/tb'
// import DynamicExperienceForm from './DynamicExperienceForm'
// import { BASE_URL } from '../../../../utils/base'
// import UiSelect from '../../../components/general/UiSelect'
import axios from "axios";
import { IoCheckboxSharp } from 'react-icons/io5';
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { ResourceContext } from '../../../context/ResourceContext'
import { AuthContext } from '../../../context/AuthContex'
import TextEditor from '../../pages/settings/components/TextEditor'
import SocialsForm from '../../pages/settings/components/SocialsForm';
import { BASE_URL } from '../../../utils/base';
import { onSuccess } from '../../../utils/notifications/OnSuccess';
import { Country, State, City } from 'country-state-city';

const NewForm = ({ setIsOpen }) => {

    const { getCandidate, setGetCandidate } = useContext(ResourceContext);

    const { authDetails, userUpdate } = useContext(AuthContext)
    const user = authDetails?.user
    const [errorMsg, setErrorMsg] = useState(null)
    const [showMsg, setShowMsg] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectId, setSelectId] = useState(null);
    const [selectStates, setSelectStates] = useState();
    const [selectState, setSelectState] = useState();
    const [selectCity, setSelectCity] = useState();
    const [countryInfo, setCountryInfo] = useState();

    const [socialHandles, setSocialHandles] = useState([
        { network: "", url: "", },
    ]);

    useEffect(() => {
        setGetCandidate((prev) => {
            return {
                ...prev, isDataNeeded: true
            }
        })
    }, [])

    console.log(getCandidate)

    const countries = Country.getAllCountries();
    const states = State.getAllStates();
    const cities = City.getAllCities();



    const toggleAccept = () => {
        setDetails((prev) => {
            return {
                ...prev, show_my_profile: !details.show_my_profile
            };
        });
    }


    function updateFirstLetter(word) {
        if (word) {
            return setSelectId(word[0]?.toUpperCase() + word.slice(1));
        } else { return setSelectId(null) }
    }

    function updateStates(word) {
        if (word) {
            const findStates = states.filter((each) => each.countryCode === "NG")
            return setSelectStates(findStates);
        } else { return setSelectStates(null) }
    }
    const [profileImageUrl, setProfileImageUrl] = useState(user.image ? user.image : null);
    const [details, setDetails] = useState({
        candidate_id: user.id ? user.id : "",
        full_name: user.first_name ? ` ${user.first_name} ${user.last_name}` : "",
        profile: null,
        date_of_birth: user.date_of_birth ? user.date_of_birth : "",
        gender: user.gender ? user.gender : "",
        phone_number: user.phone_number ? user.phone_number : "",
        email: user.email ? user.email : "",
        password: user.password ? user.password : "",
        means_of_identification: user.means_of_identification ? user.means_of_identification : "",
        nin: user.nin ? user.nin : "",
        nin_slip: user.nin_slip ? user.nin_slip : "",
        educational_qualification: user.educational_qualification ? user.educational_qualification : "",
        work_experience: user.work_experience ? user.work_experience : "",
        languages: user.languages ? user.languages : "",
        salary_type: user.salary_type ? user.salary_type : "",
        salary: user.salary ? user.salary : "",
        categories: user.categories ? user.categories : "",
        // show_my_profile: true,
        preferred_job_role: user.preferred_job_role ? user.preferred_job_role : "",
        personal_profile: user.personal_profile ? user.personal_profile : "",
        network: user.network ? user.network : "",
        contact_address: user.contact_address ? user.contact_address : "",
        country: user.country ? user.country : "",
        state: user.state ? user.state : "",
        local_gov: user.local_gov ? user.local_gov : "",
        address: user.address ? user.address : "",
        experience: user.experience ? user.experience : "",
        introduction_video: null,
        background_profile: null,
        social_media_handle: [],
    })

    // console.log(getAllFaculty.data)
    const handleOnChange = (e) => {
        const { value, name, files, type, checked } = e.target;
        // let countryInfo = {}
        if (name === "means_of_identification") {
            updateFirstLetter(value)
        }
        if (name === "country") {
            const countryInfoDetails = Country.getCountryByCode(value)
            setCountryInfo(countryInfoDetails)
            // console.log(countryInfo.name)
            const states = State.getStatesOfCountry(countryInfoDetails?.isoCode);
            setSelectStates(states);
            console.log(countryInfoDetails?.name);
            setDetails((prev) => {
                return {
                    ...prev,
                    [name]: type === "checkbox" ? checked : type === "file" ? files[0] : countryInfoDetails?.name,
                    // [name]: name === 'cv' ? files[0] : value,
                };
            });

        } else if (name == "state") {
            const cities = City.getCitiesOfState(countryInfo.isoCode, value);
            setSelectCity(cities)
            const stateName = State.getStateByCodeAndCountry(value, countryInfo.isoCode)
            setSelectState(stateName.name)
            setDetails((prev) => {
                return {
                    ...prev,
                    [name]: type === "checkbox" ? checked : type === "file" ? files[0] : cities.name,
                    // [name]: name === 'cv' ? files[0] : value,
                };
            });
        }
        setDetails((prev) => {
            return {
                ...prev,
                [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
                // [name]: name === 'cv' ? files[0] : value,
            };
        });
        setErrorMsg(null);
    };

    const handleOutline = (event) => {
        setDetails((prev) => {
            return {
                ...prev, experience: event
            };
        });
        setErrorMsg("");
    };

    // const handleEducation = (event) => {
    //     setDetails((prev) => {
    //         return {
    //             ...prev, educational_qualification: event
    //         };
    //     });
    //     setErrorMsg("");
    // };
    useEffect(() => {
        setDetails(details => {
            return {
                ...details, social_media_handle: socialHandles
            }
        })
    }, [socialHandles])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg(null)
        setLoading(true)
        setGetCandidate((prev) => {
            return {
                ...prev, isDataNeeded: false
            }
        })
        details.country = countryInfo?.name;
        details.state = selectState;
        axios.post(`${BASE_URL}/candidate/UpdateCandidate/${user.id}`, details, {
            headers: {
                Authorization: `Bearer ${authDetails.token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                console.log(response)
                onSuccess({
                    message: 'Profile',
                    success: response.data.message
                })
                localStorage.setItem("userDetails", JSON.stringify(response.data.candidate));
                // setUserUpdate(updateData)
                setLoading(false)
                // toast.success("successful");
                setGetCandidate((prev) => {
                    return {
                        ...prev, isDataNeeded: true
                    }
                })
                setIsOpen(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false);
                if (error.response) {
                    setErrorMsg({ stack: error.response.data.message })
                    setShowMsg(true)
                    setLoading(false);
                } else {
                    console.log(error)
                    setErrorMsg({ network: error.message })
                    setShowMsg(true)
                    setLoading(false);
                }
                setLoading(false);
            });
    }

    const getImageURL = (e) => {
        const { name } = e.target;
        const file = e.target.files[0]; //filelist is an object carrying all details of file, .files[0] collects the value from key 0 (not array), and stores it in file

        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            // You can also perform additional actions with the valid file
            const generatedUrl = URL.createObjectURL(file);
            setProfileImageUrl(generatedUrl);
            setDetails({ ...details, [name]: file });
        } else {
            // Handle invalid file type
            alert('Please select a valid JPEG or PNG file.');
        }
    };
    // console.log(selectStates) 
    // const findStates = states.filter((each) => each.countryCode === "NG")
    // console.log(cities)
    // const testStates = State.getStatesOfCountry("NG")

    // console.log(testStates)
    console.log(details)
    return (
        <div className='text-[#515B6F]'>

            <div className="my-4 w-full">
                <div className="flex flex-col md:flex-row items-center pb-6 border-b">
                    <div className="w-full md:w-1/3 pr-5">
                        <p className="font-medium mb-2 text-slate-950">Profile Photo</p>
                        <p>This image will be shown publicly as your profile picture, it will help recruiters recognize you!</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:w-2/3 gap-2 items-center">
                        <div className="flex-shrink-0 size-[100px]  ring-green-200 ring-4 rounded-full bg-gray-300 mx-5">
                            <div className="">
                                <img className='w-[100px] h-[100px] rounded-full' src={profileImageUrl} alt="" />
                            </div>
                        </div>
                        <label htmlFor='profile' className="min-h-32 w-[90%] md:w-[90%] cursor-pointer bg-green-50 border-2 border-green-500 border-dashed p-3 md:p-5 rounded">
                            <div className="text-center">
                                <div className="flex justify-center">
                                    <span className='text-green-500 mb-3'><TbPhoto /></span>
                                </div>
                                <p><span className='text-green-500 font-medium'>Click to replace </span>or drag and drop</p>
                                <p>SVG, PNG, JPG or GIF (max. 400 x 400px)</p>
                                <input type="file"
                                    accept='.jpeg, .png, .jpg, .pdf'
                                    name='image' onChange={getImageURL} id='profile' className='invisible ' />
                            </div>
                        </label>
                    </div>
                </div>
                <div className="update_form py-6">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="w-full">
                                <div className="border-b py-6">
                                    <div className="flex flex-col md:flex-row gap-y-2">
                                        <div className="font-medium w-full md:w-2/6 text-slate-900">
                                            <p>Personal Information</p>
                                        </div>
                                        <div className="w-full md:w-4/6">
                                            <div className="mb-4">
                                                <label className="block">
                                                    <span className="block text-sm font-medium text-slate-700">Full Name</span>
                                                    <input type="text" required value={details.full_name} name='full_name' onChange={handleOnChange}
                                                        className="mt-1 block p-1 focus:outline-none w-full border" />
                                                </label>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">Phone Number</span>
                                                        <input type="text" required
                                                            value={details.phone_number} name='phone_number' onChange={handleOnChange}
                                                            placeholder='+44 1245 572 135'
                                                            className="mt-1 block p-1 focus:outline-none w-full border" />
                                                    </label>
                                                </div>
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">Email</span>
                                                        <input type="email"
                                                            value={details.email} onChange={handleOnChange}
                                                            placeholder='Jakegyll@gmail.com'
                                                            className="mt-1 block p-1 focus:outline-none w-full border" />
                                                    </label>
                                                </div>
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">Date of Birth</span>
                                                        <input type="date"
                                                            value={details.date_of_birth} name='date_of_birth' onChange={handleOnChange}
                                                            className="mt-1 block p-1 focus:outline-none w-full border" />
                                                    </label>
                                                </div>
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700 mb-1">Gender</span>
                                                        <select
                                                            value={details.gender} name='gender' onChange={handleOnChange}
                                                            id="" className='border w-full focus:outline-none p-2 pb-1'>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700 mb-1">Select Type of ID</span>
                                                        <select
                                                            value={details.means_of_identification} name='means_of_identification' onChange={handleOnChange}
                                                            id="" className='border w-full focus:outline-none p-2 pb-1'>
                                                            <option value="">-- Select --</option>
                                                            <option value="nin">National Identity Card (NIN)</option>
                                                            <option value="license">Drivers License </option>
                                                            <option value="passport">International Passport </option>
                                                        </select>
                                                    </label>
                                                </div>
                                                {/* <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">Type of ID</span>
                                                        <input type="text" required value={details.means_of_identification} name='means_of_identification' onChange={handleOnChange}
                                                            className="mt-1 block p-1 focus:outline-none w-full border" />
                                                    </label>
                                                </div> */}
                                                {selectId && (
                                                    <div className="">
                                                        <label className="block">
                                                            <span className="block text-sm font-medium text-slate-700">Input {selectId} No:</span>
                                                            <input type="text" value={details.nin} name='nin' onChange={handleOnChange}
                                                                className="mt-1 block p-1 focus:outline-none w-full border" />
                                                        </label>
                                                    </div>)}
                                                {selectId && (
                                                    <div className="">
                                                        <label className="block">
                                                            <span className="block text-sm font-medium text-slate-700">Upload {selectId}</span>
                                                            <input type="file"
                                                                name='nin_slip' onChange={handleOnChange}
                                                                className="mt-1 block p-1 focus:outline-none w-full border" />
                                                        </label>
                                                    </div>)}
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">Background Image</span>
                                                        <input type="file"
                                                            accept='.jpeg, .png, .jpg,'
                                                            name='background_profile' onChange={handleOnChange}
                                                            className="mt-1 block p-1 focus:outline-none w-full border" />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b py-6">
                                    <div className="flex flex-col md:flex-row gap-y-2">
                                        <div className="font-medium w-full md:w-2/6 text-slate-900">
                                            <p>Professional Details</p>
                                        </div>
                                        <div className="w-full md:w-4/6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700 mb-1">Educational Qualification</span>
                                                        <select
                                                        required
                                                            value={details.educational_qualification} name='educational_qualification'
                                                            onChange={handleOnChange}
                                                            id="" className='border w-full focus:outline-none p-2 pb-1'>
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
                                                        <span className="block text-sm font-medium text-slate-700 mb-1">Work Experience</span>
                                                        <select

                                                            value={details.work_experience} name='work_experience' onChange={handleOnChange}
                                                            className='border w-full focus:outline-none p-2 pb-1'>
                                                            <option value="">-- select --</option>
                                                            <option value="1">1 year</option>
                                                            <option value="2">2 years</option>
                                                            <option value="3">3 years</option>
                                                            <option value="4">4 years </option>
                                                            <option value="5">5 years</option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700 mb-1">Language</span>
                                                        <select
                                                            value={details.languages} name='languages' onChange={handleOnChange}
                                                            className='border w-full focus:outline-none p-2 pb-1'>
                                                            <option value="">-- select --</option>
                                                            <option value="english">English</option>
                                                            <option value="french">French</option>
                                                            <option value="hausa">Hausa </option>
                                                            <option value="yaruba">Yaruba</option>
                                                            <option value="igbo">Igbo</option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700 mb-1">Salary Type</span>
                                                        <select
                                                        required
                                                            value={details.salary_type} name='salary_type' onChange={handleOnChange}
                                                            className='border w-full focus:outline-none p-2 pb-1'>
                                                            <option value="">-- select --</option>
                                                            <option value="monthly">Monthly</option>
                                                            <option value="hourly">Hourly</option>
                                                            <option value="contract">Contract</option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">Salary (₦)</span>
                                                        <input type="number"

                                                            value={details.salary} name='salary' onChange={handleOnChange}
                                                            className="mt-1 block p-1 focus:outline-none w-full border" />
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">Preferred Job Role</span>
                                                        <input type="text" required
                                                            value={details.preferred_job_role} name='preferred_job_role' onChange={handleOnChange}
                                                            className="mt-1 block p-1 focus:outline-none w-full border" />
                                                    </label>
                                                </div> <div className="mb-4">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">Personal Profile</span>
                                                    </label>
                                                    <textarea
                                                        required
                                                        value={details.personal_profile} name='personal_profile' onChange={handleOnChange}
                                                        className="mt-1 block w-full focus:outline-green-400 border" id=""></textarea>
                                                </div>
                                                {/* <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700 mb-1">Show my profile</span>
                                                        <select
                                                            value={details.show_my_profile} name='show_my_profile' onChange={handleOnChange}
                                                            className='border w-full focus:outline-none p-2 pb-1'>
                                                            <option value="true">show</option>
                                                            <option value="false">Hide</option>
                                                        </select>
                                                    </label>
                                                </div> */}
                                                {/* <div className="">
                                                    <span className="block text-sm font-medium text-slate-700 mb-1">Show my profile</span>
                                                    <button
                                                        onClick={() => toggleAccept()}
                                                        type='button'
                                                        className='border-0 prime_brown inherit_bg'>
                                                        {details.show_my_profile ? (
                                                            <IoCheckboxSharp size={25} />
                                                        ) : (
                                                            <MdOutlineCheckBoxOutlineBlank size={25} />
                                                        )}
                                                    </button>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label>
                                            <p className="font-bold mb-5">Experience</p>
                                            <TextEditor
                                                textValue={details.experience}
                                                handleText={handleOutline} />
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
                                <div className="border-b py-6">
                                    <div className="flex flex-col md:flex-row gap-y-2">
                                        <div className="font-medium w-full md:w-2/6 text-slate-900">
                                            <p>Contact Details</p>
                                        </div>
                                        <div className="w-full md:w-4/6">
                                            <div className="mb-4">
                                                <label className="block">
                                                    <span className="block text-sm font-medium text-slate-700">Contact Address</span>
                                                    <input type="text"
                                                        value={details.contact_address} name='contact_address' onChange={handleOnChange}
                                                        className="mt-1 block p-1 focus:outline-none w-full border" />
                                                </label>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700 mb-1">Country</span>
                                                        <select
                                                            value={details.country} name='country' onChange={handleOnChange}
                                                            className='border w-full focus:outline-none p-2 pb-1'>
                                                            <option value="">-- select --</option>
                                                            {
                                                                countries.map((country) => (
                                                                    <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700 mb-1">State</span>
                                                        <select
                                                            value={details.state} name='state' onChange={handleOnChange}
                                                            className='border w-full focus:outline-none p-2 pb-1'>
                                                            <option value="">-- select --</option>
                                                            {selectStates?.map((each) => (
                                                                <option key={each.name} value={each.isoCode}>{each.name}</option>
                                                            ))}
                                                            {/* <option value="kano">Kano</option>
                                                            <option value="lagos">Lagos</option>
                                                            <option value="Ondo">Ondo</option> */}
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700 mb-1">Local Governmennt</span>
                                                        <select
                                                            value={details.local_gov} name='local_gov' onChange={handleOnChange}
                                                            className='border w-full focus:outline-none p-2 pb-1'>
                                                            <option value="">-- select --</option>
                                                            {selectCity?.map((city) => (
                                                                <option key={city.name} value={city.name}>{city.name}</option>
                                                            ))}
                                                            {/* <option value="kuje">Kuje</option>
                                                            <option value="abaji">Abaji</option>
                                                            <option value="gwagwalada">Gwagwalada</option> */}
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">Address</span>
                                                        <input type="text"
                                                            value={details.address} name='address' onChange={handleOnChange}
                                                            className="mt-1 block p-1 focus:outline-none w-full border" />
                                                    </label>
                                                </div>
                                                {/* <div className="mb-4">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">Experience</span>
                                                        <input type="text"
                                                            value={details.experience} name='experience' onChange={handleOnChange}
                                                            className="mt-1 block p-1 focus:outline-none w-full border" />
                                                    </label>
                                                </div> */}
                                                <div className="">
                                                    <SocialsForm
                                                        experiences={socialHandles}
                                                        setExperiences={setSocialHandles} />
                                                </div>
                                                {/* <div className="">
                                                    <DynamicExperienceForm />
                                                </div> */}
                                                <div className="">
                                                    <label className="block">
                                                        <span className="block text-sm font-medium text-slate-700">My introduction video</span>
                                                        <input type="file"
                                                            accept='.mp4'
                                                            name='introduction_video' onChange={handleOnChange}
                                                            placeholder='Jakegyll@gmail.com'
                                                            className="mt-1 block p-1 focus:outline-none w-full border" />
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
                                                    <p className="text-red-700 text-base font-medium" key={index}> {error}</p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errorMsg?.network && (
                                    <div className="py-4 border-b mb-8 text-center">
                                        <p className="text-red-700 text-base font-medium"> {errorMsg.network}</p>
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
                                <button className="rounded border prime_bg text-white px-4 py-2 flex justify-center w-[50%]">Save Profile
                                    {loading && <div className="size-[20px] ml-3 animate-spin rounded-full border-r-4  border- "></div>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewForm