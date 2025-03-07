import React, { useState, useEffect, useContext } from 'react';
import UseModal from '../../../components/general/UseModal';
import JobForm from './JobForm';
import { ResourceContext } from '../../../../context/ResourceContext';

const JobApplicationForm = ({ job, getResumeById, hasApplied }) => {
    const { getCandidate, setGetCandidate, getAllApplications, setGetAllApplications } = useContext(ResourceContext);

    const [isOpen, setIsOpen] = useState(false);
    const header = "Fill the form to apply";

    useEffect(() => {
        setGetCandidate((prev) => ({
            ...prev,
            isDataNeeded: true,
        }));
    }, [setGetCandidate]);

    return (
        <>
            {/* Apply Button */}
            <button
                disabled={hasApplied}
                onClick={() => setIsOpen(true)}
                className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base green_btn text-white hover:bg-green-700 rounded-md"
            >
                {hasApplied ? "Applied" : "Apply"}
            </button>

            {/* Modal */}
            <UseModal header={header} setIsOpen={setIsOpen} isOpen={isOpen}>
                <div className="sm:p-4">
                    <JobForm
                        setIsOpen={setIsOpen}
                        getCandidate={getCandidate.data}
                        resume={getResumeById}
                        updateAllApplications={setGetAllApplications}
                        job={job}
                    />
                </div>
            </UseModal>
        </>
    );
};

export default JobApplicationForm;
