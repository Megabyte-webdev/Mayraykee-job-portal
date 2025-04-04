import React, { useState } from 'react'
import CustomizedCheckbox from '../../jobs/components/CustomizedCheckbox'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const CompanySizeType = ({setCompanySize}) => {
    const [close, setClose] = useState(false)
    return (
        <div>
            <div className="mb-5">
                <div className="flex justify-between cursor-pointer"  onClick={() => setClose(!close)}>
                    <p className="font-bold">Company Size</p>
                    <button
                       
                    >{close ? <FaChevronUp /> : <FaChevronDown />}</button>
                </div>
                {close && (
                    <div className="">
                        <CustomizedCheckbox 
                        setSelectedValue={setCompanySize}
                        values={{
                            name: "comapnySize",
                            value: "1-49",
                            label: "Small",
                            id: "101"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setCompanySize}
                        values={{
                            name: "comapnySize",
                            value: "50-249",
                            label: "Medium",
                            id: "151"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setCompanySize}
                        values={{
                            name: "comapnySize",
                            value: "250+",
                            label: "Large",
                            id: "251"
                        }} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CompanySizeType