import React from 'react';
import headerImg from "../../../assets/pngs/detail-logo.png";
import { BsShare } from 'react-icons/bs';
import { FaRegCheckCircle, FaArrowLeft } from 'react-icons/fa';
import healthIcon from "../../../assets/pngs/perks-n-benefits/tethoscope.png";
import vacation from "../../../assets/pngs/perks-n-benefits/vacation.png";
import cam from "../../../assets/pngs/perks-n-benefits/cam.png";
import arrowUp from "../../../assets/pngs/perks-n-benefits/kite-up.png";
import coffee from "../../../assets/pngs/perks-n-benefits/coffee-cup.png";
import trainIcon from "../../../assets/pngs/perks-n-benefits/vehicle.png";
import unity from "../../../assets/pngs/perks-n-benefits/unity.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const CompanyDetails = () => {
    const { state } = useLocation();
    const job = state?.company;
    const navigate = useNavigate();
    const postedDate = new Date(job.created_at);
    const keywordArr = job.search_keywords?.split(',');
   
    return (
        <div className="h-full text-[#25324b] w-full">
            <div className='py-6 border-b mb-8'>
                <div className="job_header p-6">
                    <div className="p-3 bg-white border">
                        <div className="flex justify-between items-center">
                            <div className="flex">
                                <img src={headerImg} className="object-cover" width={80} alt={`${job.company_name} logo`} />
                                <div className="ml-3">
                                    <p className="text-base mb-4 font-bold">{job.company_name}</p>
                                    <p className="mb-3">· {job.location} · {job.type}</p>
                                </div>
                            </div>
                            <button className="md:border-r md:mr-5">
                                <BsShare />
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/applicant/browse-companies")}
                    className='mt-4 flex items-center px-5 md:px-10'>
                    <FaArrowLeft size={20} className="mr-1" />
                </button>
                <div className="my-10">
                    <div className="flex flex-col md:flex-row px-5 md:px-10">
                        <div className="w-full md:w-[80%] pr-4">
                            <div className="mb-6">
                                <h4 className='font-bold mb-4'>Address:</h4>
                                <p>{job.address}</p>
                            </div>
                            <div className="mb-6">
                                <h4 className='font-bold mb-4'>Description:</h4>
                                <p dangerouslySetInnerHTML={{ __html: job.company_profile }} />
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 md:pl-4">
                            <h4 className="font-bold mb-4">More Information</h4>
                            <div className="text-sm p-2 bg-gray-100 mb-6">
                                <div className="flex my-4 bg-gray-300">
                                    <div className="pt-1 bg-[#56CDAD] w-[50%]"></div>
                                </div>
                                <p><b>5 applied</b> of 10 capacity</p>
                            </div>
                            <div className="my-6 border-b">
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Website:</p>
                                    <p className="font-medium">{job.profile_url}</p>
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Ref No:</p>
                                    <p className="font-medium">{job.rc_number}</p>
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Network:</p>
                                    <p className="font-medium">{job.network}</p>
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Founded:</p>
                                    <p className="font-medium">{job.year_of_incorporation}</p>
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Email:</p>
                                    <p className="font-medium break-words">{job.email}</p>
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Sector:</p>
                                    <p className="font-medium">{job.sector}</p>
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Socials:</p>
                                    {job.social_media?.map((social, index) => (
                                        <Link key={index} to={social.url} className="font-medium">{social.name}</Link>
                                    ))}
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Currency:</p>
                                    <p className="font-medium">{job.currency}</p>
                                </div>
                            </div>
                            <div className="my-6 border-b pb-6">
                                <h4 className="font-bold mb-4">Categories</h4>
                                <div className="flex flex-wrap gap-1 text-xs">
                                    {keywordArr?.map((each, index) => (
                                        <button key={index} className="px-3 py-1 rounded-full odd:bg-amber-100 text-amber-500 even:bg-teal-50 even:text-teal-400">{each}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-6 border-b">
                <h4 className="font-bold text-xl">Perks & Benefits</h4>
                <p>This job comes with several perks and benefits:</p>
                <div className="my-5 pb-4 flex flex-wrap text-sm">
                    {[
                        { img: healthIcon, title: "Full Healthcare", desc: "We believe in thriving communities and that starts with our team being happy and healthy." },
                        { img: vacation, title: "Unlimited Vacation", desc: "We believe you should have a flexible schedule that makes space for family, wellness, and fun." },
                        { img: cam, title: "Skill Development", desc: "We believe in always learning and leveling up our skills. Whether it's a conference or online course." },
                        { img: arrowUp, title: "Team Summit", desc: "Every 6 months we have a full team summit where we have fun, reflect, and plan for the upcoming quarter." },
                        { img: coffee, title: "Remote Working", desc: "We believe in thriving communities and that starts with our team being happy and healthy." },
                        { img: trainIcon, title: "Commuter Benefits", desc: "We’re grateful for all the time and energy each team member puts into getting to work every day." },
                        { img: unity, title: "We give back", desc: "We anonymously match any donation our employees make (up to $/€ 600) so they can support the organizations they care about most—times two." }
                    ].map((perk, index) => (
                        <div key={index} className="p-2 w-full md:w-1/4">
                            <div className="hover:shadow p-2 h-full transition-all hover:scale-105">
                                <div className="my-2">
                                    <img src={perk.img} alt={perk.title} />
                                </div>
                                <h6 className="font-bold mb-3">{perk.title}</h6>
                                <p>{perk.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CompanyDetails;
