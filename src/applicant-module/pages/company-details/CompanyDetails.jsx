import React from "react";
import headerImg from "../../../assets/pngs/detail-logo.png";
import { BsShare } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resourceUrl } from '../../../services/axios-client';
import { onSuccess } from '../../../utils/notifications/OnSuccess';
import {onFailure} from '../../../utils/notifications/OnFailure';

const CompanyDetails = () => {
    const { state } = useLocation();
    const job = state?.company;
    const navigate = useNavigate();
    const keywordArr = job?.search_keywords?.split(",");
    console.log(job)
    const shareCompanyDetails = async () => {
    const shareText = `
🏢 **Company Name:** ${job.company_name}
📍 **Location:** ${job.location}
💼 **Sector:** ${job.sector}
🌐 **Website:** ${job.profile_url}

This opportunity is brought to you by **Mayrahkee Africa**!  
Discover more and join us today to explore opportunities.

🔗 [Register and Learn More Here!](${window.location.origin}/registration)
    `;

    try {
        if (navigator.share) {
            // Use the native share API without an image
            await navigator.share({
                title: `Explore Opportunities at ${job.company_name}`,
                text: shareText,
                //url: `${window.location.origin}/register`,
            });
        } else {
            // Fallback: copy text to clipboard
            await navigator.clipboard.writeText(shareText);
        }
    } catch (error) {
        // if (error.name === "AbortError") {
        //     onFailure({
        //         message: "Sharing Cancelled",
        //         error: "You cancelled the sharing process.",
        //     });
        // } else {
        //     console.error("Error sharing company details:", error);
        //     onFailure({
        //         message: "Sharing Error",
        //         error: "An error occurred while sharing.",
        //     });
        // }
    }
};
    

    return (
        <div className="h-full text-[#25324b] w-full">
            <div className="py-6 border-b mb-8">
                <div className="job_header p-6 sticky top-0">
                    <div className="p-3 bg-white border">
                        <div className="flex justify-between items-center">
                            <div className="flex">
                                <img
                                    src={`${resourceUrl}${job?.logo_image}`}
                                    className="object-cover w-20 h-20 bg-gray-400"
                                    alt="logo"
                                />
                                <div className="ml-3">
                                    <p className="text-base mb-4 font-bold">{job.company_name}</p>
                                    <p className="mb-3">· {job.location} · {job.type}</p>
                                </div>
                            </div>
                            <button onClick={shareCompanyDetails} className="md:border-r md:mr-5 p-2 rounded-full border hover:bg-gray-100">
                                <BsShare />
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/applicant/browse-companies")}
                    className="mt-4 flex items-center px-5 md:px-10"
                >
                    <FaArrowLeft size={20} className="mr-1" />
                </button>
                <div className="my-10">
                    <div className="flex flex-col md:flex-row px-5 md:px-10">
                        <div className="w-full md:w-[80%] pr-4">
                            <div className="mb-6">
                                <h4 className="font-bold mb-4">Address:</h4>
                                <p>{job.address}</p>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-bold mb-4">Company Description:</h4>
                                <p dangerouslySetInnerHTML={{ __html: job.company_profile }} />
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 md:pl-4">
                            <h4 className="font-bold mb-4">More Information</h4>
                            <div className="text-sm p-2 bg-gray-100 mb-6">
                                <div className="flex my-4 bg-gray-300">
                                    <div
                                        className="pt-1 bg-[#56CDAD]"
                                        style={{
                                            width: `${Math.min((job?.company_size / 100) * 100, 100)}%`,
                                        }}
                                    ></div>
                                </div>
                                <p>
                                    <b>Company size:</b> {job?.company_size}
                                </p>
                            </div>
                            <div className="my-6 border-b">
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Website:</p>
                                    <p className="font-medium">{job.profile_url}</p>
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Founded:</p>
                                    <p className="font-medium">{job.year_of_incorporation}</p>
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Sector:</p>
                                    <p className="font-medium">{job.sector}</p>
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Email:</p>
                                    <p className="font-medium break-words">{job.email}</p>
                                </div>
                                <div className="flex flex-wrap my-3 justify-between">
                                    <p>Socials:</p>
                                    {job.social_media?.map((social, index) => (
                                        <Link key={index} to={social.url} className="font-medium">
                                            {social.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            {keywordArr && <div className="my-6 border-b pb-6">
                                <h4 className="font-bold mb-4">Categories</h4>
                                <div className="flex flex-wrap gap-1 text-xs">
                                    {keywordArr?.map((each, index) => (
                                        <button
                                            key={index}
                                            className="px-3 py-1 rounded-full odd:bg-amber-100 text-amber-500 even:bg-teal-50 even:text-teal-400"
                                        >
                                            {each}
                                        </button>
                                    ))}
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;
