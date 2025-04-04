import React, { useContext, useEffect, useState } from "react";
import MainLogo from "../../assets/pngs/mayrahkee-logo-2.png";
import Padlock from "../../assets/pngs/padlock.png";
import Person from "../../assets/pngs/person.png";
import { GiCircle, GiPlainCircle } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import "../../utils/notifications/OnSuccess";
import { onSuccess } from "../../utils/notifications/OnSuccess";
import FormButton from "../FormButton";
import useLogin from "../../hooks/useLogin";
import mayrahkeeIcon from "../../assets/pngs/mayrahkee-logo-2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import HowItWorksSlider from "./HowItWorksSlider";
import { AuthContext } from "../../context/AuthContex";
import { SessionContext } from "../../context/SessionContext";

function LoginForm() {
  const [role, setRole] = useState();
  const navigate = useNavigate();
  const { loginDetails, loginUser, loading, onTextChange } = useLogin(role);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const toggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    loginUser(() => {
      onSuccess({
        message: "Login Successful",
        success: "Continuing to dashboard",
      });
      if (role === "candidate") {
        navigate("/applicant");
      } else if (role == "employer") {
        navigate("/company");
      } else {
        navigate("/staff");
      }
    });
  };

  useEffect(() => {
    setRole("candidate");
  }, []);
  return (
    <div
      id="login-form"
      className={`h-full w-full md:w-[65%] flex flex-col pt-[%] md:pt-[3%] items-center  bg-primaryColor md:bg-white md:rounded-md   px-[3%] py-[10px]`}
    >
      <img src={mayrahkeeIcon} className="w-60 md:hidden mt-[3%]" />

      <div
        id="login-section"
        className="flex flex-col justify-between w-[80%] md:w-[80%] gap-2 md:mt-10  lg:w-[60%] mt-0  min-h-[60%] items-center"
      >
        <h3 className="font-bold text-2xl text-white md:text-black">
          Login to your Account
        </h3>
        <span className="font-meduim text-center w-[60%] md:w-[90%] text-gray-200 md:text-gray-400 text-[12px] md:text-[11px]">
          Explore & manage job different job opportunities
        </span>
        <div className="grid grid-cols-2 w-full md:mt-10 gap-[10px] text-sm font-semibold">
          <button
            onClick={() => setRole("candidate")}
            className={`px-2 py-1 text-little ${role === "candidate"
                ? "scale-[103%] shadow-sm shadow-black md:text-primaryColor text-white  border bg-white/30 md:bg-primaryColor/30"
                : "md:text-white text-gray-500 bg-white md:bg-primaryColor border-0"
              }`}
          >
            Corporate Candidate
          </button>
          <button
            onClick={() => setRole("employer")}
            className={`px-2 py-1 text-little ${role === "employer"
                ? "scale-[103%] shadow-sm shadow-black md:text-lightblue text-white  border bg-lightblue/30"
                : "md:text-white text-gray-500 bg-white md:bg-lightblue border-0"
              }`}
          >
            Corporate Employer
          </button>
          <button
            onClick={() => setRole("artisan")}
            className={`px-2 py-1 text-little ${role === "artisan"
                ? "scale-[103%] shadow-sm shadow-black md:text-darkblue text-white  border bg-darkblue/30"
                : "md:text-white text-gray-500 bg-white md:bg-darkblue border-0"
              }`}
          >
            Artisan
          </button>
          <button
            onClick={() => setRole("staff")}
            className={`px-2 py-1 text-little ${role === "staff"
                ? "scale-[103%] shadow-sm shadow-black md:text-lightorange text-white  border bg-lightorange/30"
                : "md:text-white text-gray-500 bg-white md:bg-lightorange border-0"
              }`}
          >
            Domestic Staff
          </button>
        </div>
        <form
          onSubmit={handleOnSubmit}
          id="form-wrapper"
          className="flex flex-col mt-[5%] md:mt-10 w-full md:w-full lg:w-full gap-[15px] items-center "
        >
          <div className="h-[40px] w-full flex items-center bg-white md:bg-opacity-100 pl-[10px] gap-[10px] rounded-md border-[1.5px]">
            <img src={Person} className="h-[20px]" />
            <input
              name="email"
              type="text"
              value={loginDetails.email}
              onChange={onTextChange}
              required
              className="w-full h-full placeholder:text-little text-md md:bg-white/0 focus:bg-white/0 active:bg  focus:outline-none text-gray-700 "
              placeholder="Enter email or phone"
            />
          </div>

          <div className="h-[40px] w-full flex items-center pl-[10px] pr-[5px] mt-[10px] bg-white md:bg-opacity-100  gap-[10px] rounded-md border-[1.5px]">
            <img src={Padlock} className="h-[20px]" />
            <input
              name="password"
              type={!showPassword ? "text" : "password"}
              value={loginDetails.password}
              onChange={onTextChange}
              required
              placeholder="Enter your password"
              className="w-[90%] h-full placeholder:text-md text-sm md:bg-white/0 focus:outline-none text-gray-700 "
            />
            {showPassword ? (
              <FaEyeSlash
                className="cursor-pointer text-green-600"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <FaEye
                className="cursor-pointer text-green-600"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>

          <div className="flex justify-between text-sm w-full text-white md:text-gray-800">
            <p className="flex items-center gap-[3px]">
              {rememberMe ? (
                <GiPlainCircle
                  onClick={toggleRememberMe}
                  className="text-primaryColor cursor-pointer"
                />
              ) : (
                <GiCircle className="cursor-pointer" onClick={toggleRememberMe} />
              )}

              <span onClick={toggleRememberMe} className="cursor-pointer">
                Remember Me
              </span>
            </p>
            <p className="cursor-pointer hover:underline">
              <NavLink to={"/forgot-password"}>Forgot Password?</NavLink>
            </p>
          </div>

          <FormButton
            width="w-full md:bg-primaryColor md:text-white bg-white"
            loading={loading}
          >
            Login to continue
          </FormButton>
        </form>
        <p className="flex  w-full group items-center cursor-pointer  justify-center gap-[3px] text-md all text-white md:text-gray-800">
          <NavLink
            to="/registration"
            className="hover:underline peer font-semibold "
          >
            Do you have an account?
            <span className=" ml-2  md:text-primaryColor">Sign up</span>
          </NavLink>{" "}
        </p>
      </div>
    </div>
  );
}

export default React.memo(LoginForm);
