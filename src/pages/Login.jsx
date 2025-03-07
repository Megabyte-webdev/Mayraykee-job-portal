import React, { useEffect, useState, useContext } from "react";
import LoginForm from "../components/Auth/LoginForm";
import LoginOne from "../assets/pngs/login-image2.png";
import { Helmet } from "react-helmet";
import SideCard from "../components/Auth/SideCard";
import { useNavigate } from "react-router-dom";
import { redirect, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
function Login() {
  const { authDetails } = useContext(AuthContext);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email_phone: "",
    password: "",
  });


  const toogleRememberMe = () => setRememberMe(!rememberMe);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(loginDetails);
  };


  const redirectPath = () => {
    switch (authDetails?.user?.role) {
      case "candidate":
        return "/applicant";
      case "employer":
        return "/company";
      case "staff":
        return "/staff";
    }
  };

  return (authDetails?.user?.role ? (
    <Navigate to={redirectPath()} />
  ) :
    <>
      <Helmet>
        <title>Login Page</title>
      </Helmet>
      <main
        id="login-Wrapper"
        className={`h-screen w-screen flex bg-center items-start justify-start relative `}
      >
        <SideCard />

        <LoginForm
          rememberMe={rememberMe}
          toogleRememberMe={toogleRememberMe}
          handleOnSubmit={handleOnSubmit}
          setLoginDetails={setLoginDetails}
        />
      </main>
    </>
  );
}

export default Login;
