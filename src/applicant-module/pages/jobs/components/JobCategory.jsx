import React, { useState, useContext, useEffect } from 'react';
import CustomizedCheckbox from './CustomizedCheckbox';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { JobContext } from '../../../../context/JobContext';

const JobCategory = ({ setCategory }) => {
    const { getSectors } = useContext(JobContext);
    const [sectorList, setSectorList] = useState([]);
    const [close, setClose] = useState(false);

    useEffect(() => {
        const init = async () => {
            const jobSectors = await getSectors();
            setSectorList(jobSectors?.sort((a,b)=>a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())) || []);
        };
        init();
    }, [getSectors]);

    return (
        <div>
            <div className="mb-5">
                <div
                    className="flex justify-between cursor-pointer"
                    onClick={() => setClose(!close)}
                >
                    <p className="font-bold">Sector</p>
                    <button>{close ? <FaChevronUp /> : <FaChevronDown />}</button>
                </div>
                {close && (
                    <div>
                        {/* Undo Checkbox */}
                        <CustomizedCheckbox
                            setSelectedValue={setCategory}
                            values={{
                                label: "Undo",
                                value: "",
                                id: "undoCategory",
                                name: "sector",
                            }}
                        />
                        {/* Dynamically generated checkboxes for sectors */}
                        {sectorList.map((sector) => (
                            <CustomizedCheckbox
                                key={sector.id || sector.value}
                                setSelectedValue={setCategory}
                                values={{
                                    label: sector?.name,
                                    value: sector?.name,
                                    id: `sector-${sector.id}` ,
                                    name: "sector",
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobCategory;
