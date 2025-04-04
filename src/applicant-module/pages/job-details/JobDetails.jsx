import React, { useContext, useEffect, useState } from 'react';
import { BsShare } from 'react-icons/bs';
import { FaRegCheckCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import headerImg from '../../../assets/pngs/detail-logo.png';
import JobApplicationForm from './components/JobApplicationForm';
import { ResourceContext } from '../../../context/ResourceContext';
import { resourceUrl } from '../../../services/axios-client';
import { onSuccess } from '../../../utils/notifications/OnSuccess';
import { onFailure } from '../../../utils/notifications/OnFailure';
import { Country } from 'country-state-city';
import useJobManagement from '../../../hooks/useJobManagement';
import { formatDate, parseHtml } from '../../../utils/formmaters';
 
const JobDetails = () => {
    const { state } = useLocation();
    const job = state?.job;

    const { getResumeById, setGetResumeById } = useContext(ResourceContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setGetResumeById((prev) => ({
            ...prev,
            isDataNeeded: true,
        }));
    }, [setGetResumeById]);

    const postedDate = job ? new Date(job.created_at) : new Date();
    const keywordArr = job?.search_keywords?.split(',') || [];

    const shareJobDetails = async (jobDetails) => {
        const shareText = `
🌟 **Job Title:** ${jobDetails.job_title}
📍 **Location:** ${jobDetails.location}
💼 **Type:** ${jobDetails.type}
📅 **Apply Before:** ${jobDetails.application_deadline_date}

This exciting opportunity is brought to you by **Mayrahkee Africa**! 
Don't miss out—join us today to apply.

🔗 [Register and Apply Here!](${window.location.origin}/registration)
        `;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Exciting Opportunity by Mayrahkee Africa: ${jobDetails.job_title}`,
                    text: shareText,
                });
                
            } else {
                await navigator.clipboard.writeText(shareText);
            }
        } catch (error) {
            console.error('Error sharing job details:', error);
        }
    };

    return (
        <div className="w-full min-h-full text-[#25324b]">
            <div className="sticky top-0 bg-white z-10 p-6 border-b mb-8 shadow-md">
                <div className="p-6 bg-white border rounded-md">
                    <div className="flex gap-2 flex-wrap justify-between items-center">
                        <div className="flex items-start space-x-4">
                            <img src={`${resourceUrl}/${job?.featured_image}`} alt="Job" className="w-20" />
                            <div>
                                <p className="text-lg font-bold mb-2">{job?.job_title}</p>
                                <p className="text-sm mb-1">· {job?.location} · {job?.type}</p>
                                <p className="text-sm">
                                    <b>Address:</b> {job?.office_address}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button onClick={() => shareJobDetails(job)} className="p-2 rounded-full border hover:bg-gray-100">
                                <BsShare />
                            </button>
                            <JobApplicationForm
                                job={job}
                                getResumeById={getResumeById.data}
                                hasApplied={state?.hasApplied}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row px-6 min-h-full">
                <div className="w-full md:w-4/5 pr-4">
                    <div className="mb-6">
                        <h4 className="font-bold mb-2">Description</h4>
                        <p>{parseHtml(job?.job_description)}</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-bold mb-2">Experience</h4>
                        <p>{parseHtml(job?.experience)}</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-bold mb-2">Qualifications</h4>
                        {job?.qualification?.map((each, i) => (
                            <div key={i} className="flex items-center space-x-2 mb-2">
                                <FaRegCheckCircle className="text-green-500" />
                                <span>{each}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/5">
                    <h4 className="font-bold mb-2">About this role</h4>
                    {/* <div className="bg-gray-100 p-4 rounded-md mb-6">
                        <p className="text-sm">
                            <b>{job?.number_of_participants || 0} Applicants Expected</b>
                        </p>
                    </div> */}

                    <div className="space-y-3 border-b pb-4">
                        <div className="flex flex-wrap justify-between gap-2">
                            <p>Apply Before:</p>
                            <p className="font-medium">{formatDate(job?.application_deadline_date)}</p>
                        </div>
                        <div className="flex flex-wrap justify-between gap-2">
                            <p>Job Posted On:</p>
                            <p className="font-medium">{formatDate(postedDate)}</p>
                        </div>
                        <div className="flex flex-wrap justify-between gap-2">
                            <p>Email:</p>
                            <p className="font-medium break-words">{job?.email}</p>
                        </div>
                        <div className="flex flex-wrap justify-between gap-2">
                            <p>Job Type:</p>
                            <p className="font-medium">{job?.type}</p>
                        </div>
                        <div className="flex flex-wrap justify-between gap-2">
                            <p>Salary Type:</p>
                            <p className="font-medium">{job?.salary_type}</p>
                        </div>
                        <div className="flex flex-wrap justify-between gap-2">
                            <p>Currency:</p>
                            <p className="font-medium">{job?.currency}</p>
                        </div>
                    </div>

                    <div className="my-6">
                        <h4 className="font-bold mb-2">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                            {keywordArr.map((each, index) => (
                                <button
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-teal-50 text-teal-400 odd:bg-amber-100 odd:text-amber-500"
                                >
                                    {each}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
