import React, { useState, useContext, useEffect } from 'react';
import CustomizedCheckbox from './CustomizedCheckbox';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { JobContext } from '../../../../context/JobContext';

const EmploymentCategory = ({ setEmploymentType }) => {
    const { getEmployentTypes } = useContext(JobContext);
    const [employmentList, setEmploymentList] = useState([]);
    const [close, setClose] = useState(false);

    useEffect(() => {
        const init = async () => {
            const employmentType = await getEmployentTypes();
            setEmploymentList(employmentType || []);
        };
        init();
    }, [getEmployentTypes]);

    return (
        <div>
            <div className="mb-5">
                <div
                    className="flex justify-between cursor-pointer"
                    onClick={() => setClose(!close)}
                >
                    <p className="font-bold">Type of Employment</p>
                    <button>{close ? <FaChevronUp /> : <FaChevronDown />}</button>
                </div>
                {close && (
                    <div>
                        {/* Undo Checkbox */}
                        <CustomizedCheckbox
                            setSelectedValue={setEmploymentType}
                            values={{
                                label: "Undo",
                                value: "",
                                id: "undoEmployment",
                                name: "employmentType"
                            }} />
                        {/* Dynamically generated checkboxes for sectors */}
                        {employmentList?.map((employment) => (
                            <CustomizedCheckbox
                                key={employment.id || employment.value}
                                setSelectedValue={setEmploymentType}
                                values={{
                                    label: employment?.name,
                                    value: employment?.name,
                                    id: `emploment-${employment.id}` ,
                                    name: "employmentType",
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmploymentCategory;