import React, { useState } from "react";
import CustomizedCheckbox from "./CustomizedCheckbox";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const careerData = [
  { id: 1, name: "Internship" },
  { id: 2, name: "Management Trainee" },
  { id: 3, name: "Entry level" },
  { id: 4, name: "Intermediate level" },
  { id: 5, name: "Middle level" },
  { id: 6, name: "Senior level" },
  { id: 7, name: "Management level" },
  { id: 8, name: "Executive" },
  { id: 9, name: "Board of Directors" },
];

const JobLevelCategory = ({ setJobLevel }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-5">
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="font-bold">Job Level</p>
        <button>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</button>
      </div>

      {isOpen && (
        <div>
          {/* Undo option */}
          <CustomizedCheckbox
            setSelectedValue={setJobLevel}
            values={{
              label: "Undo",
              value: "",
              id: "levelNil",
              name: "CareerLevel",
            }}
          />

          {/* Dynamically generate checkboxes from careerData */}
          {careerData.map(({ id, name }) => (
            <CustomizedCheckbox
              key={id}
              setSelectedValue={setJobLevel}
              values={{
                label: name,
                value: name,
                id: id.toString(),
                name: "CareerLevel",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobLevelCategory;
