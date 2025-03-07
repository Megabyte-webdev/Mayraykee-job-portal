import React, { useState } from 'react'
import CustomizedCheckbox from '../../jobs/components/CustomizedCheckbox'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const Insdustriestype = ({ setIndustry }) => {
    const [close, setClose] = useState(false)
    return (
        <div>
            <div className="mb-5">
                <div className="flex justify-between cursor-pointer" onClick={() => setClose(!close)}>
                    <p className="font-bold">Industries</p>
                    <button
                        
                    >{close ? <FaChevronUp /> : <FaChevronDown />}</button>
                </div>
                {close && (
                    <div className="">
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "",
                            label: "Undo",
                            id: "industryNil"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Advertising",
                            label: "Advertising",
                            id: "Advertising"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Tech",
                            label: "Technology",
                            id: "Tech"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Business",
                            label: "Business Service",
                            id: "business"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Block",
                            label: "Block Chain",
                            id: "blockChain"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Cloud",
                            label: "Cloud",
                            id: "Cloud"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Consumer",
                            label: "Consumer Tech",
                            id: "Consumer"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Education",
                            label: "Education",
                            id: "Education"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Fintech",
                            label: "Fintech",
                            id: "Fintech"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Gaming",
                            label: "Gaming",
                            id: "Gaming"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Food",
                            label: "Food",
                            id: "Food"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Health",
                            label: "Healthcare",
                            id: "Healthcare"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Hosting",
                            label: "Hosting",
                            id: "Hosting"
                        }} />
                        <CustomizedCheckbox 
                        setSelectedValue={setIndustry}
                        values={{
                            name: "industry",
                            value: "Media",
                            label: "Media",
                            id: "Media"
                        }} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Insdustriestype