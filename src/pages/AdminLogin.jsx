import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseAdminManagement from "../hooks/useAdminManagement";
import { AuthContext } from "../context/AuthContex";
import MainLogo from "../assets/pngs/main-logo-icon.png";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

function AdminLogin() {
  const [rememberMe, setRememberMe] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { adminLogin } = UseAdminManagement();
  const { setAuthDetails } = useContext(AuthContext);
  const navigate = useNavigate();

  const toogleRememberMe = () => setRememberMe(!rememberMe);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await adminLogin(loginDetails);
      console.log("Response login:", response);
      if (response) {
        toast.success("Login successful!");
        setAuthDetails({
          token: response.token,
          user: response.admin,
        });
        setLoading(false);
        navigate("/admin/");
      } else {
        toast.error("Incorrect credentials");
        setLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error("Error details:", error);
      setLoading(false);
    }
  };

  const onTextChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  return (
    <>
      <Helmet>
        <title>Admin Login Page</title>
      </Helmet>
      <ToastContainer />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex justify-center mb-4">
          <img src={MainLogo} alt="Main Logo" className="h-12" />
        </div>
        <div className="bg-[#0F5A02] p-16 rounded-md shadow-md w-full max-w-lg">
          <h1 className="text-center text-white py-4 text-2xl">Welcome back Admin!</h1>
          <form onSubmit={handleOnSubmit}>
            <div className="mb-6">
              <div className="flex items-center bg-white p-3 rounded-md border">
                <input
                  name="email"
                  type="text"
                  onChange={onTextChange}
                  required
                  className="w-full bg-transparent focus:outline-none"
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center bg-white p-3 rounded-md border">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={onTextChange}
                  required
                  className="w-full bg-transparent focus:outline-none"
                  placeholder="Enter password"
                />
                {showPassword ? (
                  <FaEyeSlash
                    className="cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <FaEye
                    className="cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <NavLink to="/admin/forget-pwd" className="text-sm hover:underline text-white">
                Forgot Password?
              </NavLink>
            </div>
            <button type="submit" className="w-full bg-[#47AA49] text-white p-3 rounded-md hover:bg-green-700 flex items-center justify-center gap-2">
              Login {loading && <FaSpinner size="24" className="animate-spin" />}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default AdminLogin;
