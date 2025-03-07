import React from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceUrl } from '../../../../services/axios-client';

const CompanyGridCard = ({ newApplicant, company }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => {
                navigate(`/applicant/browse-companies/${company?.id}`, { state: { company: company } });
                scrollTo(0, 0);
            }}
            className="border cursor-pointer hover:shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2"
        >
            <div className="p-3 h-full transition-all transform hover:scale-104">
                <div className="flex justify-between items-start my-3">
                    <div className="w-14 h-14 flex-shrink-0 rounded-full border bg-gray-400 overflow-hidden">
                        <img
                            src={`${resourceUrl}${company?.logo_image}` || newApplicant}
                            className="rounded-full w-full h-full object-cover transition-transform transform hover:rotate-6"
                            alt=""
                        />
                    </div>
                    <button className="mx-2 py-1 px-2 rounded-full bg-green-100 text-green-700 border transition-all hover:bg-white hover:scale-105">
                        Employees: {company.company_size}
                    </button>
                </div>
                <div>
                    <p><b>{company.company_name}</b></p>
                    <p className="mb-2">{company.location}</p>
                    <p className="mb-2">{company.address}</p>
                    <div className="flex flex-wrap items-start my-6">
                        <button className="mr-2 mt-2 py-1 px-2 border-green-500 rounded-full bg-white hover:bg-green-100 text-green-700 border transition-all hover:scale-105">
                            {company.sector}
                        </button>
                        <button className="mr-2 mt-2 py-1 px-2 rounded-full bg-green-100 hover:bg-white text-green-700 border transition-all hover:scale-105">
                            {company.network}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyGridCard;
