import React, { useContext, useEffect, useState } from 'react'
import { BASE_URL, IMAGE_URL } from '../../../../utils/base'
import axios from "axios";
import { AuthContext } from '../../../../context/AuthContex'
import { ResourceContext } from '../../../../context/ResourceContext'
import { onSuccess } from '../../../../utils/notifications/OnSuccess';
import { onFailure } from '../../../../utils/notifications/OnFailure';
import { FcApproval } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { extractErrorMessage } from '../../../../utils/formmaters'
const JobForm = ({ setIsOpen, getCandidate, job, resume, updateAllApplications }) => {
    const navigate = useNavigate();
    const { authDetails } = useContext(AuthContext)

    const [errorMsg, setErrorMsg] = useState(null)
    const [showMsg, setShowMsg] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resumePicker, setResumePicker] = useState(false)
    const [activeResume, setActiveResume] = useState("")
    // const [newDetails, setNewDetails] = useState({
    //     resume: "",
    //     resumeOne: "",
    // })

    const [details, setDetails] = useState({
        candidate_id: getCandidate?.candidateAuth?.id,
        job_id: job.id,
        full_name: `${getCandidate?.candidateAuth?.first_name} ${getCandidate?.candidateAuth?.last_name}`,
        email: getCandidate?.candidateAuth?.email,
        phone_number: getCandidate?.details?.phone_number,
        job_title: job.job_title,
        employer_id: job.employer_id,
        resume_id: "",
        status: "in-review",
        // linkedin_url: "",
        // portfolio_url: "",
        additional_information: "",
        resume_path: "",
    })
    const user = authDetails?.user

    function handleActive(id) {
        setActiveResume(id)
        setDetails((prev) => (
            { ...prev, resume_id: id }
        ))
    }

    const handleOnChange = (e) => {
        const { value, name, files, type, checked } = e.target;
        if (name === "resume") {
            setResumePicker(true)
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

    const handleSubmit = (e) => {
        e.preventDefault();
        updateAllApplications((prev) => {
            return {
                ...prev, isDataNeeded: false
            }
        })
        setErrorMsg(null)
        setLoading(true)
        axios.post(`${BASE_URL}/apply`, details, {
            headers: {
                Authorization: `Bearer ${authDetails.token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                console.log(response)
                onSuccess({
                    message: 'New Application',
                    success: response.data.message
                })
                updateAllApplications((prev) => {
                    return {
                        ...prev, isDataNeeded: true
                    }
                })
                setLoading(false)
                setIsOpen(false)
                navigate("/applicant/find-job")
            })
            .catch((error) => {
                console.log(error)
                onFailure({ message: "Job Application Failed!", error: extractErrorMessage(error) })
                setLoading(false);

            });
    }

    console.log(details)
    // console.log(job)


    const handleSuccess = () => {
        onSuccess({
            message: 'New Job',
            success: 'Job Created Successfully'
        })
    }
    console.log(resume)
    return (
        <div className='text-[#515B6F]'>

            <div className="my-4">
                <div className="update_form py-6">
                    <div>
                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                            {resume?.length > 0 ?
                                resume?.map((item) => {
                                    const active = activeResume === item.id
                                    return (
                                        <>
                                            {/* <button
                                            onClick={() => handleActive(item.id)}
                                            key={item.id} className="p-3 rounded bg-green-300 relative">
                                            {item.title}
                                            <span className='absolute top-0'> {active && (<FcApproval />)}</span>
                                        </button> */}
                                            <div
                                                onClick={() => handleActive(item.id)}
                                                key={item.id}
                                                className={`p-4 cursor-pointer border relative rounded shadow-2xl justify-between flex-col flex ${active ? "bg-green-100" : ""}`}>
                                                <div>
                                                    <div className="flex justify-between w-full">
                                                        <p className="text-green-600 font-medium">{item.title}</p>
                                                        <span className='absolute right-0 top-0'> {active && (<FcApproval size={30} />)}</span>
                                                    </div>
                                                    <div className="details">
                                                        <div className="flex justify-center mb-3">
                                                            <div className='md:w-50'>
                                                                <div className="mb-3">
                                                                    <img className='w-[100px] h-[100px] rounded-full'
                                                                        src={`${IMAGE_URL}/${getCandidate?.details?.profile}`}
                                                                        alt={`${getCandidate.details?.full_name} profile image`} />
                                                                </div>
                                                                <h3 className="font-bold">{getCandidate.details?.full_name}</h3>
                                                            </div>
                                                        </div>
                                                        <div className="grid md:grid-cols-3 gap-3 break-all">
                                                            <div className="">
                                                                <p className="font-bold">Address:</p>
                                                                <p>{getCandidate.details?.address}</p>
                                                            </div>
                                                            <div className="">
                                                                <p className="font-bold">Phone:</p>
                                                                <p>{getCandidate.details?.phone_number}</p>
                                                            </div>
                                                            <div className="">
                                                                <p className="font-bold">Email:</p>
                                                                <p className='break-words'>{getCandidate.details?.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap my-3 break-all">
                                                            <div className="w-2/4">
                                                                <p className="font-bold text-base">Employment</p>
                                                                <p className="font-medium text-base">Position</p>
                                                            </div>
                                                            <div className="w-2/4">
                                                                <p className="font-medium">{item.company_name}</p>
                                                                <p className="">{item.position_held}</p>
                                                                <p><span>{item.start_date}</span> - <span>{item.end_date}</span></p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap break-all my-3">
                                                            <div className="w-2/4">
                                                                <p className="font-bold text-base">Education</p>
                                                            </div>
                                                            <div className="w-2/4">
                                                                <p className="font-medium">{item.educational_institution}</p>
                                                                <p><span>{item.year_of_entry}</span> - <span>{item.year_of_graduation}</span></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className=' w-full'>
                                                {errorMsg && (
                                                    <div className="flex justify-center my-3">
                                                        <small className="text-red-700 text-center">{errorMsg}</small>
                                                    </div>
                                                )}
                                                <div className="flex justify-center mt-3">
                                                    <button
                                                        onClick={deleteUser}
                                                        className='px-4 rounded bg-red-500 text-white'
                                                        disabled={loading}
                                                    >{loading ? "Deleting" : "Delete"}</button>
                                                </div>
                                            </div> */}
                                            </div>
                                        </>
                                    )
                                }) : (
                                    <div className="flex flex-col gap-2 items-center justify-center mx-auto">
                                        <p className="text-sm tet-gray-700">Please you need to create a resume</p>
                                        <Link to="/applicant/my-resume" className="rounde-md text-sm px-3 py-1 bg-green-600 text-white font-medium">Create Resume</Link>
                                    </div>
                                )}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className=" md:w-">
                                <div className="border-b py-6">
                                    <div className="flex">
                                        <div className="w-full">
                                            {/* <div className="mb-4">
                                                <label className="block">
                                                    <span className="block text-sm font-medium text-slate-700">LinkedIn</span>
                                                    <input type="url" value={details.linkedin_url} name='linkedin_url' placeholder='url' onChange={handleOnChange}
                                                        className="mt-1 block p-1 focus:outline-none w-full border" />
                                                </label>
                                            </div> */}
                                            {/* <div className="mb-4">
                                                <label className="block">
                                                    <span className="block text-sm font-medium text-slate-700">Portfolio</span>
                                                    <input type="url" value={details.portfolio_url} name='portfolio_url' placeholder='url' onChange={handleOnChange}
                                                        className="mt-1 block p-1 focus:outline-none w-full border" />
                                                </label>
                                            </div> */}
                                            {/* <div className="my-4 pt-5">
                                                <label htmlFor='resume' className="cursor-pointer flex">
                                                    <span className="text-sm  bg-green-100 rounded border p-4 font-medium text-slate-700">Resume</span>
                                                    <span> {resumePicker && (<FcApproval />)}</span>
                                                    <input type="file" id='resume' name='resume' placeholder='url' onChange={handleOnChange}
                                                        className="mt-1 invisible p-1 focus:outline-none w-full border" />
                                                </label>
                                            </div> */}
                                            <div className="mb-4">
                                                <label className="block">
                                                    <span className="block text-sm font-medium text-slate-700">Additional Information</span>
                                                </label>
                                                <textarea
                                                    value={details.additional_information} name='additional_information' onChange={handleOnChange}
                                                    className="mt-1 block w-full focus:outline-green-400 border min-h-[100px]" id=""></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* {errorMsg?.stack && (
                                    <div className="py-4 border-b mb-8 text-center">
                                        {Object.keys(errorMsg.stack).map((field) => (
                                            <div key={field}>
                                                {errorMsg.stack[field].map((error, index) => (
                                                    <p className="text-red-700 text-base font-medium" key={index}> {error}</p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )} */}
                                {errorMsg && (
                                    <div className="py-4 border-b mb-8 text-center">
                                        <p className="text-red-700 text-base font-medium"> {errorMsg}</p>
                                    </div>
                                )}
                                <button className="rounded border prime_bg text-white px-4 flex justify-center py-2 w-[50%]">Save Profile
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

export default JobForm