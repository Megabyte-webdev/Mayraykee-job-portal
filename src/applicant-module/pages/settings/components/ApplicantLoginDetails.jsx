import React, { useContext, useState } from "react";
import { FaRegCheckCircle, FaSpinner } from "react-icons/fa";
import DeleteUser from "./DeleteUser";
import useLogin from "../../../../hooks/useLogin";
import OTPInput from "react-otp-input";
import { onFailure } from "../../../../utils/notifications/OnFailure";
import useApplicationManagement from "../../../../hooks/useApplicationManagement";

const ApplicantLoginDetails = ({ authDetails }) => {
  const { otp, setOtp } = useState("");
  // const { resetPassword, forgotPassword, loading } = useLogin();
  const { changePassword, loading } = useApplicationManagement();

  const handleReset = async (e) => {
    e.preventDefault();
    const currentPassword = e.target[0].value;
    const newPassword = e.target[1].value;
    const reenterPassword = e.target[2].value;

    if (newPassword === reenterPassword) {
      await changePassword(currentPassword, newPassword);
      return;
    }

    onFailure({
      message: "Change Password",
      error: "Password mismatch",
    });
  };

  // console.log(authDetails)

  return (
    <div className="p-4 md:p-6">
      <div className="update_form py-6">
        <div>
          <form onSubmit={handleReset}>
            <div className="border-b py-6">
              <div className="md:flex md:w-4/5">
                <div className="w-full md:w-2/5 pr-3 mb-4 md:mb-0">
                  <p className="font-medium text-slate-900">New Password</p>
                  <p className="text-sm text-slate-700">
                    Manage your password to make <br /> sure it is safe
                  </p>
                </div>
                <div className="w-full md:w-3/5">
                  <div className="mb-6 border-b border-dashed pb-8">
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">
                        Enter Current Password
                      </span>
                      <input
                        required
                        type="password"
                        placeholder="Enter your current password"
                        className="mt-1 block p-2 focus:outline-none w-full border"
                      />
                    </label>
                  </div>
                  <div className="mb-6 mt-5">
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">
                        Enter New Password
                      </span>
                      <input
                        required
                        type="password"
                        placeholder="Enter your new password"
                        className="mt-1 block p-2 focus:outline-none w-full border"
                      />
                    </label>
                    <span className="text-sm text-slate-600">
                      Minimum of 8 characters
                    </span>
                  </div>
                  <div className="mb-6">
                    <label className="block">
                      <span className="block text-sm font-medium text-slate-700">
                        Reconfirm New Password
                      </span>
                      <input
                        required
                        type="password"
                        placeholder="Enter your new password"
                        className="mt-1 block p-2 focus:outline-none w-full border"
                      />
                    </label>
                    <span className="text-sm text-slate-600">
                      Minimum of 8 characters
                    </span>
                  </div>
                  <span
                    onClick={() =>
                      forgotPassword(
                        authDetails.user.email,
                        authDetails.user.role
                      )
                    }
                    className="cursor-pointer gap-4 mt-2 flex items-center hover:underline hover:text-primaryColor"
                  >
                    Request for OTP
                    {loading && <FaSpinner className="animate-spin" />}
                  </span>
                  <div className="my-3">
                    <button
                      type="submit"
                      className="bg-green-700 hover:bg-green-900 p-2 px-4 text-white w-full md:w-auto"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <DeleteUser authDetails={authDetails} />
        </div>
      </div>
    </div>
  );
};

export default ApplicantLoginDetails;
