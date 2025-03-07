import React, { useState } from "react";
import useLogin from "../hooks/useLogin";
import FormButton from "../components/FormButton";
import OTPInput from "react-otp-input";
import MainLogo from "../assets/pngs/main-logo-icon.png";
import MainLogo2 from "../assets/pngs/mayrahkee-logo-2.png";

// import Person from "../assets/pngs/person.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setRole] = useState();
  const [otp, setOtp] = useState("");
  const { loading, forgotPassword, resetPassword } = useLogin();
  const [showResetPassword, setShowResetPassword] = useState(false);

  return (
    <main className="flex h-screen w-full ">
      <div className="md:w-[60%] flex px-[5%] flex-col items-center justify-center gap-[5%] ">
        <img className="w-[60%] block md:hidden" src={MainLogo} />
        <div className="grid grid-cols-2 md:w-[60%] gap-[10px] text-sm font-semibold">
          <button
            onClick={() => setRole("candidate")}
            className={`px-2 py-1 text-little ${
              role === "candidate"
                ? "md:text-white text-gray-500 bg-white md:bg-primaryColor border-0"
                : "md:text-primaryColor text-gray-300  border bg-white/30 md:bg-primaryColor/30"
            }`}
          >
            Corperate Candidate
          </button>
          <button
            onClick={() => setRole("employer")}
            className={`px-2 py-1 text-little ${
              role === "employer"
                ? "md:text-white text-gray-500 bg-white md:bg-primaryColor border-0"
                : "md:text-primaryColor text-gray-300  border bg-white/30 md:bg-primaryColor/30"
            }`}
          >
            Corperate Employer
          </button>
          <button
            onClick={() => setRole("artisan")}
            className={`px-2 py-1 text-little ${
              role === "artisan"
                ? "md:text-white text-gray-500 bg-white md:bg-primaryColor border-0"
                : "md:text-primaryColor text-gray-300  border bg-white/30 md:bg-primaryColor/30"
            }`}
          >
            Artisan
          </button>
          <button
            onClick={() => setRole("staff")}
            className={`px-2 py-1 text-little ${
              role === "staff"
                ? "md:text-white text-gray-500 bg-white md:bg-primaryColor border-0"
                : "md:text-primaryColor text-gray-300  border bg-white/30 md:bg-primaryColor/30"
            }`}
          >
            Domestic Staff
          </button>
        </div>
        {/* Forgot Password  */}
        {!showResetPassword ? (
          <div className="flex flex-col justify-center items-center gap-[10px]">
            <h1 className="font-bold text-[25px] text-gray-600">
              Forgot Password
            </h1>
            <p className="text-[18px] text-gray-600 font-meduim">
              Enter your mail to reset
            </p>

            <div className="h-[45px] w-full flex mt-[10px] items-center pl-[10px] gap-[10px] rounded-md border-[1.5px]">
              <img src={""} className="h-[20px]" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="text"
                required
                className="w-full h-full placeholder:text-sm text-sm bg-white/0 focus:bg-white/0  focus:outline-none text-gray-700 "
                placeholder="Enter email address"
              />
            </div>

            <FormButton
              loading={loading}
              onClick={() => {
  forgotPassword(email, role)
    .then((response) => {
      // Assuming the API response has a success indicator, e.g., `response.success`
      if (response) {
        setShowResetPassword(true);
      } else {
        // Handle the error case if the response indicates failure
        console.error("Password reset failed", response?.message || "Unknown error");
      }
    })
    .catch((error) => {
      // Handle network or other unexpected errors
      console.error("Error during forgot password request", error);
    });
}}

            >
              Verify
            </FormButton>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-[10px]">
            <h1 className="font-bold text-[25px] text-gray-600">
              Forgot Password
            </h1>

            <div className="h-fit w-full flex flex-col mt-[10px] items-center gap-[10px] rounded-md ">
              <input
                onChange={(e) => setpassword(e.target.value)}
                name="password"
                type="password"
                required
                className="w-full border p-2 rounded-md h-full placeholder:text-sm text-sm bg-white/0 focus:bg-white/0  focus:outline-none text-gray-700 "
                placeholder="Enter new password"
              />
              <div className="flex flex-col items-start">
                <span className="text-little">Enter OTP</span>
                <div className="border p-2 rounded-md">
                  <OTPInput
                    onChange={(val) => setOtp(val)}
                    value={otp}
                    numInputs={4}
                    inputStyle={{
                      background: "white",
                      fontSize: "25px",

                      borderBottom: "1px solid gray",
                      height: "30px",
                      width: "60px",
                    }}
                    renderSeparator={<sdiv className="w-[10px]" />}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>
              </div>
            </div>

            <FormButton
              loading={loading}
              onClick={() => {
                resetPassword(email, password, otp, role);
              }}
            >
              Reset
            </FormButton>
          </div>
        )}

        {/* Reset Password */}
      </div>

      <div className="hidden md:flex bg-primaryColor w-[40%] bg-[length:100%_110%] items-center justify-center" >
      <img className="h-[15%] hidden md:block" src={MainLogo2} />
      </div>
    </main>
  );
}

export default ForgotPassword;
