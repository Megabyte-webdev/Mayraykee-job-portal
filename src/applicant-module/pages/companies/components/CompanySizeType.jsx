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
                            value: "",
                            label: "Undo",
                            id: "sizeNil"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setCompanySize}
                        values={{
                            name: "comapnySize",
                            value: "50",
                            label: "50-100",
                            id: "50"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setCompanySize}
                        values={{
                            name: "comapnySize",
                            value: "100",
                            label: "101-150",
                            id: "101"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setCompanySize}
                        values={{
                            name: "comapnySize",
                            value: "151",
                            label: "151-250",
                            id: "151"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setCompanySize}
                        values={{
                            name: "comapnySize",
                            value: "251",
                            label: "251-500",
                            id: "251"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setCompanySize}
                        values={{
                            name: "comapnySize",
                            value: "501",
                            label: "501-1000",
                            id: "501"
                        }} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CompanySizeType