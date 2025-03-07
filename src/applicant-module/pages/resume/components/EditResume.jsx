import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../context/AuthContex';
import { FaEdit, FaRegCheckCircle } from 'react-icons/fa';
import { BASE_URL } from '../../../../utils/base';
import { ResourceContext } from '../../../../context/ResourceContext';
import axios from 'axios';
import { FcApproval } from 'react-icons/fc';
import { onSuccess } from '../../../../utils/notifications/OnSuccess';
// import Resume from './components/Resume';
import UseModal from '../../../components/general/UseModal';

const EditResume = ({ resume }) => {
    const { authDetails } = useContext(AuthContext);
    const { getResumeById, setGetResumeById } = useContext(ResourceContext);

    const user = authDetails?.user
    // const [active, setActive] = useState("log")
    const [errorMsg, setErrorMsg] = useState(null)
    const [resumePicker, setResumePicker] = useState(false)
    const [portfolioPicker, setPortfolioPicker] = useState(false)
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [details, setDetails] = useState({
        candidate_id: user.id,
        title: resume.title,
        resume: null,
        educational_institution: resume.educational_institution,
        academy_name: resume.academy_name,
        year_of_entry: resume.year_of_entry,
        year_of_graduation: resume.year_of_graduation,
        company_name: resume.company_name,
        position_held: resume.position_held,
        start_date: resume.start_date,
        end_date: resume.end_date,
        portfolio: null,
        awarding_institution: resume.awarding_institution,
        qualification_title: resume.qualification_title,
        year_attended: resume.year_attended,
    })

    const handleOnChange = (e) => {
        const { value, name, files, type, checked } = e.target;
        if (name === "resume") {
            setResumePicker(true)
        }
        if (name === "portfolio") {
            setPortfolioPicker(true)
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
    useEffect(() => {
        setGetResumeById((prev) => {
            return {
                ...prev, isDataNeeded: true
            }
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg(null)
        setLoading(true)
        setGetResumeById((prev) => {
            return {
                ...prev, isDataNeeded: false
            }
        })
        axios.post(`${BASE_URL}/updateResumes/${resume.id}`, details, {
            headers: {
                Authorization: `Bearer ${authDetails.token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                console.log(response)
                onSuccess({
                    message: 'Resume Edit',
                    success: response.data.message
                })
                // localStorage.setItem("userDetails", JSON.stringify(response.data.candidate));
                // setUserUpdate(updateData)
                setLoading(false)
                setIsOpen(false)
                setGetResumeById((prev) => {
                    return {
                        ...prev, isDataNeeded: true
                    }
                })
                // toast.success("successful");
            })
            .catch((error) => {
                console.log(error)
                if (error.response) {
                    setErrorMsg(error.response.data.error)
                    setLoading(false);
                } else {
                    console.log(error)
                    setErrorMsg(error.message)
                    setLoading(false);
                }
            });
    }

    // console.log(details)
    // console.log(getResumeById)
    return (
        <div className="">
            <button
                onClick={() => setIsOpen(true)}
                className='p-3'>
                <FaEdit />
            </button>
            <UseModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                header="Update Resume"
            >
                <form onSubmit={handleSubmit}>
                    <div className="border-b py-6">
                        <div className="flex md:w-4/5">
                            <div className="w-full">
                                <div className="mb-4">
                                    <div className='mb-5'>
                                        <div className='font-medium mb-5 text-2xl text-slate-900 flex'>Add Resume
                                            {/* <span className='ml-2 prime_text'><FaRegCheckCircle /></span> */}
                                        </div>
                                    </div>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700 flex gap-1">Title of Resume <strong className="text-red-500">*</strong> </span>
                                            <input onChange={handleOnChange} type="text" required value={details.title} name='title' placeholder='e.g, my professional resume'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <div className="my-4 pt-5">
                                        <label htmlFor='resume' className="cursor-pointer flex">
                                            <span className="text-sm  bg-green-100 rounded border p-4 font-medium text-slate-700 text-nowrap">Add Resume</span>
                                            <span> {(resumePicker || details?.resume) && (<FcApproval />)}</span>
                                            <input type="file" id='resume' name='resume' placeholder='url' onChange={handleOnChange}
                                                className="mt-1 invisible p-1 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700 flex gap-1">Education (Institution) <strong className="text-red-500">*</strong></span>
                                            <input onChange={handleOnChange} type="text" required value={details.educational_institution} name='educational_institution' placeholder='Name of Educational Institution'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                    </div>

                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700 flex gap-1">Year of Entry <strong className="text-red-500">*</strong></span>
                                            <input onChange={handleOnChange} type="text" value={details.year_of_entry} name='year_of_entry' placeholder='e.g 2020'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700 flex gap-1">Year of Graduation <strong className="text-red-500">*</strong></span>
                                            <input onChange={handleOnChange} type="text" value={details.year_of_graduation} name='year_of_graduation' placeholder='e.g 2020'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <p className="font-medium text-base my-6"> Academy</p>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700">Name of Academy (For Creative)</span>
                                            <input onChange={handleOnChange} type="text" value={details.academy_name} name='academy_name' placeholder='Enter academy name'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700">Awarding Institution</span>
                                            <input onChange={handleOnChange} type="text" value={details.awarding_institution} name='awarding_institution' placeholder='Institution'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700">Qualification</span>
                                            <input onChange={handleOnChange} type="text" value={details.qualification_title} name='qualification_title' placeholder='Qualification'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700">Year Of Entry</span>
                                            <input onChange={handleOnChange} type="text" value={details.year_attended} name='year_attended' placeholder='Year Of Entry'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                        
                                    </div>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700">Year Of Graduation</span>
                                            <input onChange={handleOnChange} type="text" value={details.year_of_graduation} name='year_attended' placeholder='Year Of Graduation'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                        
                                    </div>
                                    <div className="my-4 pt-5">
                                        <label htmlFor='portfolio' className="cursor-pointer flex">
                                            <span className="text-sm  bg-green-100 rounded border p-4 font-medium text-slate-700 text-nowrap">Add Portfolio</span>
                                            <span> {portfolioPicker && (<FcApproval />)}</span>
                                            <input type="file" id='portfolio' name='portfolio' placeholder='portfolio' onChange={handleOnChange}
                                                className="mt-1 invisible p-1 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <p className="font-medium text-base my-6"> Previous Work Experience</p>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700">Company Name</span>
                                            <input onChange={handleOnChange} type="text" value={details.company_name} name='company_name' placeholder='Enter company name'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700">Position Held</span>
                                            <input onChange={handleOnChange} type="text" value={details.position_held} name='position_held' placeholder='position'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700">Start Date</span>
                                            <input onChange={handleOnChange} type="date" value={details.start_date} name='start_date' placeholder='Enter your new email'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
                                    </div>
                                    <div className='mb-5'>
                                        <label className="block">
                                            <span className="block font-medium text-slate-700">End Date</span>
                                            <input onChange={handleOnChange} type="date" value={details.end_date} name='end_date' placeholder='Enter your new email'
                                                className="mt-1 block p-2 focus:outline-none w-full border" />
                                        </label>
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
                                <div className="my-3">
                                    <button className="rounded border prime_bg text-white px-4 flex justify-center py-2 w-[50%]">Save Resume
                                        {loading && <div className="size-[20px] ml-3 animate-spin rounded-full border-r-4  border- "></div>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </UseModal>
        </div>
    )
}

export default EditResume
