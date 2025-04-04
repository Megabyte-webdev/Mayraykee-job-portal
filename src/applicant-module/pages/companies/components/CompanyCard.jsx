import React from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceUrl } from '../../../../services/axios-client';

const CompanyCard = ({ company, newApplicant }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => { navigate(`/applicant/browse-companies/${company?.id}`, { state: { company: company } }); scrollTo(0, 0) }}
      className="border cursor-pointer hover:shadow-inner my-4 p-4">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col md:flex-row">
          <div className="w-14 h-14 flex-shrink-0 rounded-full border-1 bg-gray-400">
            <img src={`${resourceUrl}${company?.logo_image}` || newApplicant} className="rounded-full w-full h-full object-cover" alt="" />
          </div>
          <div className="ml-3">
            <p className="font-bold">{company.company_name}</p>
            <p className="my-1">{company.location}</p>
            <p className="my-1">{company.address}</p>
            <div className="flex flex-wrap gap-2">
              <button className="mx-2 py-1 px-2 rounded-full hover:bg-white bg-green-100 text-green-700 border">
                Company size: {company.company_size}
              </button>
              <button className="mx-2 py-1 px-2 border-yellow-500 rounded-full hover:bg-yellow-100 text-yellow-500 border">
                {company.sector}
              </button>
              <button className="mx-2 py-1 px-2 border-green-500 rounded-full hover:bg-green-100 text-green-500 border">
                Since: {company.year_of_incorporation}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:text-right">
          <button className="w-full md:w-[150px] text-white mb-2 py-2 bg-green-700 hover:bg-green-900">
            {company.phone_number}
          </button>
          {/* <div className="flex my-3 bg-gray-100">
            <div className="pt-1 bg-[#56CDAD] w-[50%]"></div>
          </div>
          <p className="text-sm"><b>5 applied</b> of 10 capacity</p> */}
        </div>
      </div>
    </div>
  );
}

export default CompanyCard;
