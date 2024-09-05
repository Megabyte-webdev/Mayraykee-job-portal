import React, { useEffect, useState } from "react";
import MainLogo from "../../assets/svgs/main-logo.svg";
import Padlock from "../../assets/pngs/padlock.png";
import Person from "../../assets/pngs/person.png";
import { GiCircle, GiPlainCircle } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import "../../utils/notifications/OnSuccess";
import { onSuccess } from "../../utils/notifications/OnSuccess";
import FormButton from "../FormButton";
import useLogin from "../../hooks/useLogin";
import mayrahkeeIcon from '../../assets/pngs/mayrakee-icon.png'


function LoginForm({ rememberMe, toogleRememberMe }) {
  const [role, setRole] = useState();
  const navigate = useNavigate();
  const { loginDetails, loginUser, loading, onTextChange } = useLogin(role);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    loginUser(() => {
      onSuccess({
        message: "Login Successful",
        success: "Continuing to dashboard",
      });
      if (role === "candidate") {
        navigate("/applicant");
      } else {
        navigate("/company");
      }
    });
  };

  useEffect(() => {
    setRole("candidate");
  }, []);
  return (
    <div
      id="login-form"
      className={`h-full w-full md:w-[65%] flex flex-col pt-[%] md:pt-[8%] items-center bg-primaryColor md:bg-white md:rounded-md  px-[3%] py-[10px]`}
    >
      <img src={mayrahkeeIcon} className="w-[60%]  md:hidden h-[15%] mt-[3%]" />

      <div
        id="login-section"
        className="flex flex-col gap-[3%]  w-[80%] md:w-[60%] mt-0 md:mt-0 h-[60%] items-center"
      >
        <h3 className="font-bold text-2xl text-white md:text-black">Login to your Account</h3>
        <span className="font-meduim text-center w-[60%] md:w-[90%] text-gray-200 md:text-gray-400 text-[12px] md:text-[11px]">
          Explore/manage job different job oppurtunities
        </span>

        <div className="grid grid-cols-2 w-full mt-[3%] gap-[10px] text-sm font-semibold text-little">
          <button
            onClick={() => setRole("candidate")}
            className={`px-2 py-1 text-little ${
              role === "candidate"
                ? "md:text-white text-gray-500 bg-white md:bg-primaryColor border-0"
                : "md:text-primaryColor text-white  border bg-white/30 md:bg-primaryColor/30"
            }`}
          >
            Corperate Candidate
          </button>
          <button
            onClick={() => setRole("employer")}
            className={`px-2 py-1 text-little ${
              role === "employer"
                 ? "md:text-white text-gray-500 bg-white md:bg-primaryColor border-0"
                : "md:text-primaryColor text-white  border bg-white/30 md:bg-primaryColor/30"
            }`}
          >
            Corperate Employer
          </button>
          <button
            onClick={() => setRole("artisan")}
            className={`px-2 py-1 text-little ${
              role === "artisan"
                 ? "md:text-white text-gray-500 bg-white md:bg-primaryColor border-0"
                : "md:text-primaryColor text-white  border bg-white/30 md:bg-primaryColor/30"
            }`}
          >
            Artisan
          </button>
          <button
            onClick={() => setRole("staff")}
            className={`px-2 py-1 text-little ${
              role === "staff"
                ? "md:text-white text-gray-500 bg-white md:bg-primaryColor border-0"
                : "md:text-primaryColor text-white  border bg-white/30 md:bg-primaryColor/30"
            }`}
          >
            Domestic Staff
          </button>
        </div>

        <form
          onSubmit={handleOnSubmit}
          id="form-wrapper"
          className="flex flex-col mt-[8%] w-full md:w-[80%] gap-[15px] items-center "
        >
          <div className="h-[40px] w-full flex items-center bg-white md:bg-opacity-100 pl-[10px] gap-[10px] rounded-md border-[1.5px]">
            <img src={Person} className="h-[20px]" />
            <input
              name="email"
              type="text"
              value={loginDetails.email}
              onChange={onTextChange}
              required
              className="w-[80%] h-full placeholder:text-little text-little  md:bg-white/0 focus:bg-white/0 active:bg  focus:outline-none text-gray-700 "
              placeholder="Enter email or phone"
            />
          </div>

          <div className="h-[40px] w-full flex items-center pl-[10px] mt-[10px] bg-white md:bg-opacity-100  gap-[10px] rounded-md border-[1.5px]">
            <img src={Padlock} className="h-[20px]" />
            <input
              name="password"
              type="password"
              value={loginDetails.password}
              onChange={onTextChange}
              required
              className="w-[80%] h-full placeholder:text-littleall text-little md:bg-white/0 focus:outline-none text-gray-700 "
              placeholder="Password"
            />
          </div>

          <div className="flex justify-between text-little w-full text-gray-400">
            <p className="flex items-center gap-[3px]">
              {rememberMe ? (
                <GiPlainCircle
                  onClick={toogleRememberMe}
                  className="text-primaryColor cursor-pointer"
                />
              ) : (
                <GiCircle
                  className="cursor-pointer"
                  onClick={toogleRememberMe}
                />
              )}
              <span onClick={toogleRememberMe} className="cursor-pointer">
                Remember Me
              </span>
            </p>
            <p className="cursor-pointer hover:underline">
              <NavLink to={"/forgot_password"}>Forgot Password?</NavLink>
            </p>
          </div>

          <FormButton width="w-full md:bg-primaryColor md:text-white bg-white" loading={loading}>Login to continue</FormButton>
        </form>

        <p className="flex w-full group items-center mt-[10px] cursor-pointer hover:underline justify-center gap-[3px] text-little all text-gray-400">
          <NavLink to="/registration">
            Do not have an account?
            <span className="text-green group-hover:underline">Sign up</span>
          </NavLink>{" "}
        </p>
      </div>
    </div>
  );
}

export default React.memo(LoginForm);
