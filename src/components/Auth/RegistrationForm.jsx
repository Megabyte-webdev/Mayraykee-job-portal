import React from "react";
import MainLogo from "../../assets/pngs/mayrahkee-logo-2.png";
import Padlock from "../../assets/pngs/padlock.png";
import Person from "../../assets/pngs/person.png";
import { GiCircle, GiPlainCircle } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import "../../utils/notifications/OnSuccess";
import { onSuccess } from "../../utils/notifications/OnSuccess";
import FormButton from "../FormButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function RegistrationForm({ acceptTerms, toogleAcceptTerms }) {
  // const { loginDetails, handleLogin, loading, onTextChange } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReenter, setShowPasswordReenter] = useState(false);


  const handleOnSubmit = (e) => {
    e.preventDefault();
    //   handleLogin()
  };

  return (
    <div
      id="login-form"
      className={`h-full w-[60%] flex pt-[8%] justify-center bg-white rounded-md  px-[3%] py-[10px]`}
    >
      <div
        id="login-section"
        className="flex flex-col gap-[3%] w-[50%] h-[60%] items-center"
      >
        <h3 className="font-bold text-2xl text-black">
          Get more opportunities{" "}
        </h3>
        <span className="font-meduim text-center w-[80%] text-gray-400 text-[11px]">
          Explore & manage job different job oppurtunities
        </span>

        <form
          onSubmit={handleOnSubmit}
          id="form-wrapper"
          className="flex flex-col mt-[3%] border-t w-full items-start "
        >
          <label className="mt-[15px] font-semibold text-sm">Full Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full h-[35px] border px-[5px] focus:bg-opacity-white placeholder:text-little text-little bg-white/0 focus:bg-white/0  focus:outline-none text-gray-700 "
            placeholder="Full Name"
          />

          <label className="mt-[15px] font-semibold text-sm">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full h-[35px] border px-[5px] focus:bg-opacity-white placeholder:text-little text-little bg-white/0 focus:bg-white/0  focus:outline-none text-gray-700 "
            placeholder="Enter email or phone"
          />

          <label className="mt-[15px] font-semibold text-sm">
           Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="w-full h-[35px] border px-[5px] placeholder:text-littleall text-little bg-white/0 focus:outline-none text-gray-700 "
            placeholder="Password"
          />

          <div className="flex justify-between items-start text-little w-full my-[10px] text-gray-400">
            <p className="flex items-center w-full gap-[3px]">
              {acceptTerms ? (
                <GiPlainCircle
                  onClick={toogleAcceptTerms}
                  className="text-primaryColor text-md w-[5%] cursor-pointer"
                />
              ) : (
                <GiCircle
                  className="cursor-pointer w-[5%] text-md"
                  onClick={toogleAcceptTerms}
                />
              )}
              <span onClick={toogleAcceptTerms} className="cursor-pointer text-center text-[11px] w-[95%]">
                By clicking 'Continue', you acknowledge that you have read and
                accept the Terms of Service and Privacy Policy.
              </span>
            </p>
          </div>

          <FormButton
            loading={false}
            onClick={() =>
              onSuccess({
                message: "Login Succesful",
                success: "Procceding to dashboard",
              })
            }
          >
            Continue
          </FormButton>
        </form>

        <p className="flex w-full group items-center mt-[10px] cursor-pointer hover:underline justify-center gap-[3px] text-little all text-gray-400">
          <NavLink to="/">
            Already have an account?
            <span className="text-green group-hover:underline"> login</span>
          </NavLink>{" "}
        </p>
      </div>
    </div>
  );
}

export default React.memo(RegistrationForm);
