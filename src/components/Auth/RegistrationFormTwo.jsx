import React, { useEffect, useReducer, useState } from "react";
import MainIcon from "../../assets/pngs/main-logo-icon.png";
import Person from "../../assets/pngs/person.png";
import PersonCircle from "../../assets/pngs/person-circle.png";
import MessageOpen from "../../assets/pngs/message-open.png";
import Card from "../../assets/pngs/card-icon.png";
import Padlock from "../../assets/pngs/padlock.png";
import { IoMdCheckbox } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import FormButton from "../../components/FormButton";
import useRegistration from "../../hooks/useRegistration";
import { onSuccess } from "../../utils/notifications/OnSuccess";
import RegistrationSelector from "../RegistrationSelector";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { axiosClient } from "../../services/axios-client";

const genders = [
  {
    id: 2000,
    name: "--select a gender--",
  },
  {
    id: 1,
    name: "Male",
  },
  {
    id: 2,
    name: "Female",
  },
];

function RegistrationFormTwo({ state, dispatch, role, setRole }) {
  const location = useLocation();
  const { id } = location?.state || {};
  const [isTrained, setIsTrained] = useState(false);
  const [gender, setGender] = useState(genders[0]);
  const client = axiosClient();
 
  const [showPassword, setShowPassword] = useState(true);
  const [showPasswordReenter, setShowPasswordReenter] = useState(true);
  const [subCategories, setSubCategories] = useState();
  const [subCategory, setSubCategory] = useState();
  const {
    regDetails,
    onTextChange,
    loading,
    registerUser,
    registerStaff,
    staffsRegDetails,
    onTextChangeStaff,
  } = useRegistration(role);
  const navigate = useNavigate();

  const toogleIsTrained = () => setIsTrained(!isTrained);

  useEffect(() => {
    if (id) {
      setRole(id);
    }
  }, [id]);
  
  const handleOnSubmit = (e) => {
    e.preventDefault();

    registerUser(gender, () => {
      onSuccess({
        message: "Registration Succesfull",
        success: "An OTP has been sent to your email ",
      });
      localStorage.setItem(
        "__reg_info",
        JSON.stringify({
          ...regDetails,
          password: "__",
          re_enter_password: "__",
        })
      );
      navigate("/registration/email_verification");
    });
  };

  const handleOnSubmitStaff = (e) => {
    e.preventDefault();

    registerStaff(
      subCategory,
      () => {
        onSuccess({
          message: "Registration Successful",
          success: "Navigating to login",
        });
        navigate("/login");
      },
      role
    );
  };

  useEffect(() => {
    console.log(role)
    const getSubCategories = async () => {
      if (role == "artisan") {
        const { data } = await client.get("/staff-categories/1");
        console.log(data.data);
        setSubCategories(data.data.subcategories);
        setSubCategory(data.data.subcategories[0]);
      } else if (role == "staff") {
        const { data } = await client.get("/staff-categories/2");
        setSubCategories(data.data.subcategories);
        setSubCategory(data.data.subcategories[0]);
      }
    };

    getSubCategories();
  }, [role]);


  return (
    <div className="md:w-[50%] w-full px-[5%] pt-[10px] flex flex-col  items-center">
      <img src={MainIcon} className="w-[60%]" />

      <div className="flex flex-col items-center gap-[8px] w-full md:w-[60%]">
        <h1 className="font-semibold text-[25px]">Create Account</h1>
        <Link to='/login' className="cursor-pointer hover:underline text-gray-600 font-medium text-sm">Already have an account? <span className='text-green-400 font-bold'>Login</span></Link>
        <div className="grid grid-cols-2 w-full mt-[3%] gap-[10px] text-sm font-semibold">
        <button
            onClick={() => setRole("candidate")}
            className={`px-2 py-1 text-little ${
              role === "candidate"
                ? "scale-[103%] shadow-sm shadow-black md:text-primaryColor text-white  border bg-gray-800/30 md:bg-primaryColor/30"
                : "md:text-white text-gray-500 bg-white md:bg-primaryColor border-0"
            }`}
          >
            Corporate Candidate
          </button>
          <button
            onClick={() => setRole("employer")}
            className={`px-2 py-1 text-little ${
              role === "employer"
                ? "scale-[103%] shadow-sm shadow-black md:text-lightblue text-white  border bg-lightblue/30"
                : "md:text-white text-gray-500 bg-white md:bg-lightblue border-0"
            }`}
          >
            Corporate Employer
          </button>
          
          <button
            onClick={() => setRole("artisan")}
            className={`px-2 py-1 text-little ${
              role === "artisan"
                ? "scale-[103%] shadow-sm shadow-black md:text-darkblue text-white  border bg-darkblue/30"
                : "md:text-white text-gray-500 bg-white md:bg-darkblue border-0"
            }`}
          >
            Artisan
          </button>
          <button
            onClick={() => setRole("staff")}
            className={`px-2 py-1 text-little ${
              role === "staff"
                ? "scale-[103%] shadow-sm shadow-black md:text-lightorange text-white  border bg-lightorange/30"
                : "md:text-white text-gray-500 bg-white md:bg-lightorange border-0"
            }`}
          >
            Domestic Staff
          </button>
        </div>
      </div>

      {role == "candidate" || role == "employer" ? (
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col w-full md:w-[65%] mt-[10px] items-center gap-[15px] md:gap-[5px] "
        >
          <div className="h-[40px] w-full flex items-center pl-[10px] gap-[10px] rounded-md border-[1.5px]">
            <img src={Person} className="h-[20px]" />
            <input
              name="first_name"
              type="text"
              value={regDetails.first_name}
              onChange={onTextChange}
              required
              className="w-[80%] h-full placeholder:text-little text-sm bg-white/0 focus:bg-white/0  focus:outline-none text-gray-700 "
              placeholder="Enter first name"
            />
          </div>

          <div className="h-[40px] w-full flex items-center pl-[10px] gap-[10px] rounded-md border-[1.5px]">
            <img src={Person} className="h-[20px]" />
            <input
              name="last_name"
              type="text"
              value={regDetails.last_name}
              onChange={onTextChange}
              required
              className="w-[80%] h-full placeholder:text-little text-sm bg-white/0 focus:bg-white/0  focus:outline-none text-gray-700 "
              placeholder="Enter last name"
            />
          </div>

          <div className="h-[40px] w-full flex items-center pl-[10px] gap-[10px] rounded-md border-[1.5px]">
            <img src={MessageOpen} className="h-[20px]" />
            <input
              name="email"
              type="email"
              value={regDetails.email}
              onChange={onTextChange}
              
              required
              className="w-[80%] h-full placeholder:text-little text-little bg-white/0 focus:bg-white/0  focus:outline-none text-gray-700 "
              placeholder="Email"
            />
          </div>
          <div className="h-[40px] w-full flex items-center pl-[10px]  gap-[10px] rounded-md border-[1.5px]">
            <img src={Padlock} className="h-[20px]" />
            <input
              name="password"
              type={!showPassword ? "text" : "password"}
              value={regDetails.password}
              onChange={onTextChange}
              required
              className="w-[80%] h-full placeholder:text-little text-sm bg-white/0 focus:outline-none text-gray-700 "
              placeholder="Password"
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
          <div className="h-[40px] w-full flex items-center pl-[10px] gap-[10px] rounded-md border-[1.5px]">
            <img src={Padlock} className="h-[20px]" />
            <input
              name="re_enter_password"
              type={!showPasswordReenter ? "text" : "password"}
              value={regDetails.re_enter_password}
              onChange={onTextChange}
              required
              className="w-[80%] h-full placeholder:text-small text-sm bg-white/0 focus:outline-none text-gray-700 "
              placeholder="Re-enter Password"
            />
            {showPasswordReenter ? (
              <FaEyeSlash
                className="cursor-pointer text-green-600"
                onClick={() => setShowPasswordReenter(!showPasswordReenter)}
              />
            ) : (
              <FaEye
                className="cursor-pointer text-green-600"
                onClick={() => setShowPasswordReenter(!showPasswordReenter)}
              />
            )}
          </div>

          <RegistrationSelector
            icon={Card}
            data={genders}
            selected={gender}
            setSelected={setGender}
          />
          <p className="text-gray-400 flex gap-[10px] items-center text-little">
            {isTrained ? (
              <IoMdCheckbox
                onClick={toogleIsTrained}
                className="text-meduim text-green"
              />
            ) : (
              <MdCheckBoxOutlineBlank
                onClick={toogleIsTrained}
                className="text-meduim"
              />
            )}{" "}
            Accept terms and conditions?
          </p>
          {<FormButton condition={!isTrained} loading={loading}>Register</FormButton>}
        </form>
      ) : (
        <form
          onSubmit={handleOnSubmitStaff}
          className="flex flex-col w-full md:w-[65%] mt-[10px] items-center gap-[15px] md:gap-[5px] "
        >
           <div className="h-[40px] w-full flex items-center pl-[10px] gap-[10px] rounded-md border-[1.5px]">
            <img src={Person} className="h-[20px]" />
            <input
              name="first_name"
              type="text"
              value={staffsRegDetails.first_name}
              onChange={onTextChangeStaff}
              required
              className="w-[80%] h-full placeholder:text-little text-sm bg-white/0 focus:bg-white/0  focus:outline-none text-gray-700 "
              placeholder="Enter first name"
            />
          </div>

          <div className="h-[40px] w-full flex items-center pl-[10px] gap-[10px] rounded-md border-[1.5px]">
            <img src={Person} className="h-[20px]" />
            <input
              name="surname"
              type="text"
              value={staffsRegDetails.surname}
              onChange={onTextChangeStaff}
              required
              className="w-[80%] h-full placeholder:text-little text-sm bg-white/0 focus:bg-white/0  focus:outline-none text-gray-700 "
              placeholder="Enter last name"
            />
          </div>

          <div className="h-[40px] w-full flex items-center pl-[10px] gap-[10px] rounded-md border-[1.5px]">
            <img src={MessageOpen} className="h-[20px]" />
            <input
              name="email"
              type="email"
              value={staffsRegDetails.email}
              onChange={onTextChangeStaff}
              required
              className="w-[80%] h-full placeholder:text-little text-little bg-white/0 focus:bg-white/0  focus:outline-none text-gray-700 "
              placeholder="Email"
            />
          </div>
          <div className="h-[40px] w-full flex items-center pl-[10px]  gap-[10px] rounded-md border-[1.5px]">
            <img src={Padlock} className="h-[20px]" />
            <input
              name="password"
              type={!showPassword ? "text" : "password"}
              value={staffsRegDetails.password}
              onChange={onTextChangeStaff}
              required
              className="w-[80%] h-full placeholder:text-little text-sm bg-white/0 focus:outline-none text-gray-700 "
              placeholder="Password"
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
          
          <div className="h-[40px] w-full flex items-center pl-[10px] gap-[10px] rounded-md border-[1.5px]">
            <img src={Padlock} className="h-[20px]" />
            <input
              name="re_enter_password"
              type={!showPasswordReenter ? "text" : "password"}
              value={staffsRegDetails.re_enter_password}
              onChange={onTextChangeStaff}
              required
              className="w-[80%] h-full placeholder:text-small text-sm bg-white/0 focus:outline-none text-gray-700 "
              placeholder="Re-enter Password"
            />
            {showPasswordReenter ? (
              <FaEyeSlash
                className="cursor-pointer text-green-600"
                onClick={() => setShowPasswordReenter(!showPasswordReenter)}
              />
            ) : (
              <FaEye
                className="cursor-pointer text-green-600"
                onClick={() => setShowPasswordReenter(!showPasswordReenter)}
              />
            )}
          </div>

          {subCategories && (
            <RegistrationSelector
              icon={Card}
              data={subCategories}
              selected={subCategory}
              setSelected={setSubCategory}
            />
          )}
          <p className="text-gray-400 flex gap-[10px] items-center text-little">
            {isTrained ? (
              <IoMdCheckbox
                onClick={toogleIsTrained}
                className="text-meduim text-green"
              />
            ) : (
              <MdCheckBoxOutlineBlank
                onClick={toogleIsTrained}
                className="text-meduim"
              />
            )}{" "}
            Accept terms and conditions?
          </p>
          <FormButton condition={!isTrained} loading={loading}>Register</FormButton>
        </form>
      )}
    </div>
  );
}

export default RegistrationFormTwo;
