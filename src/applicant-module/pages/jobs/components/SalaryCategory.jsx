import React, { useState } from 'react'
import CustomizedCheckbox from './CustomizedCheckbox'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const SalaryCategory = ({ setSalaryRange }) => {
    const [close, setClose] = useState(false)
    return (
        <div>
            <div className="mb-5">
                <div className="flex justify-between cursor-pointer" onClick={() => setClose(!close)}>
                    <p className="font-bold">Salary Range</p>
                    <button
                    >{close ? <FaChevronUp /> : <FaChevronDown />}</button>
                </div>
                {close && (
                    <div className="">
                        {/* <CustomizedCheckbox
                            setSelectedValue={setSalaryRange} values={{
                                label: "NGN7,000 - NGN10,000",
                                value: 7000,
                                name: "salaryLevel",
                                id: "7000"
                            }} /> */}
                        <CustomizedCheckbox
                            setSelectedValue={setSalaryRange} values={{
                                label: "Undo",
                                value: "",
                                name: "salaryLevel",
                                id: "salaryNil"
                            }} />
                        <CustomizedCheckbox
                            setSelectedValue={setSalaryRange} values={{
                                label: "NGN10,000 - NGN15,000",
                                value: 10000,
                                name: "salaryLevel",
                                id: "10000"
                            }} />
                        <CustomizedCheckbox
                            setSelectedValue={setSalaryRange} values={{
                                label: "NGN15,000 - NGN20,000",
                                value: 15000,
                                name: "salaryLevel",
                                id: "15000"
                            }} />
                        <CustomizedCheckbox
                            setSelectedValue={setSalaryRange} values={{
                                label: "NGN30,000 - Above",
                                value: 30000,
                                name: "salaryLevel",
                                id: "30000"
                            }} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default SalaryCategory