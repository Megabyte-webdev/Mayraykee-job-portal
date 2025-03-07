import React from 'react'

const CustomizedCheckbox = ({ values, setSelectedValue }) => {
    return (
        <label htmlFor={values.id} className="flex my-4">
            <input
            onChange={(e) => setSelectedValue(e.target.value)}
             type="radio"
                id={values.id}
                name={values.name}
                value={values.value}
                className="checked:bg-green-500 checkbox" />
            <label htmlFor={values.id} className="ml-2">{values.label}</label>
        </label>
    )
}

export default CustomizedCheckbox