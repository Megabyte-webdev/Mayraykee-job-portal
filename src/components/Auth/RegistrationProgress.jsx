
import { registration_steps_keys } from "../../utils/constants";
import { registrationType } from "../../reducers/RegistrationReducer";
import useStaffRoute from "../../routes/useStaffRoute";
import { useState, useEffect } from "react";

function RegistrationProgress({ state, dispatch, role }) {

  const keys = Object?.keys(registrationType(role));


  const getSteps = () => {
    return keys.map((key, index) => {
      const currentStep = registrationType(role)[key];
      const isSelected = currentStep?.title === state?.title;
      const icon = isSelected ? currentStep?.activeIcon : currentStep?.inactiveIcon;
      const isLast = index === keys.length - 1;

      return (
        <li key={currentStep?.title} className={`w-full flex `}>
          <div className="flex flex-col items-center w-[25%]">
            <div
              className={`bg-white rounded-md p-[15px] ${isSelected && "border-2 border-gray-800 transition duration-1000"
                }`}
            >
              <img className="h-[25px] w-[25px]" src={icon} />
            </div>
            {!isLast && <hr className="h-[25px] border-dashed border w-0" />}
          </div>
          <div>
            <p className="font-semibold text-[15px] text-white">{currentStep?.title}</p>
            <p className="font-meduim text-little text-gray-400">{currentStep?.desc}</p>
          </div>
        </li>
      );
    });
  };

  return (
    <div className="w-full h-full bg-primaryColor flex items-center justify-center">
      <ul className="">{getSteps()}</ul>
    </div>
  );
}

export default RegistrationProgress;