import React from 'react'
import { useNavigate } from 'react-router-dom'

const CompanyGridCard = ({ newApplicant, company}) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => {navigate("/applicant/browse-companies/id",  { state: { company: company} }); scrollTo(0,0)}}
            className="border cursor-pointer hover:shadow-inner">
            <div className="p-3 h-full transition-all hover:scale-105">
                <div className="flex justify-between items-start my-3">
                    <div>
                        <img src={newApplicant} width={40} alt="" />
                    </div>
                    <button className="mx-2 py-1 px-2 rounded-full hover:bg-white  bg-green-100 text-green-700 border">Employees: {company.company_size}</button>
                </div>
                <div className="">
                    <p><b>{company.company_name}</b></p>
                    <p className="mb-2">{company.location}</p>
                    <p className="mb-2">{company.address}</p>
                    <div className="flex flex-wrap items-start my-6">
                        <button className="mr-2 mt-2 py-1 px-2 border-green-500 rounded-full hover:bg-green-100 text-green-700 border text-nowrap">{company.sector}</button>
                        <button className="mr-2 mt-2 py-1 px-2 rounded-full bg-green-100 hover:bg-white text-green-700 border text-nowrap">{company.network}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyGridCard