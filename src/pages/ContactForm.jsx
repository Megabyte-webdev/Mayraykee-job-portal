
import React, { useState } from "react";
import { axiosClient } from "../services/axios-client";
import { FiMail, FiPhone } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { onFailure } from "../utils/notifications/OnFailure";
import { BASE_URL } from "../utils/base";
import { parseHtml } from "../utils/formmaters";

const ContactForm = ({ variant = "standard" }) => {
  const client = axiosClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // Check if form is valid
  const checkFormValidity = (updatedFormData, latestError) => {
    const hasErrors = Object.values({ ...errors, latestError }).some(
      (error) => error
    );
    const allFieldsFilled = Object.values(updatedFormData).every(
      (value) => value.trim() !== ""
    );
    setIsFormValid(!hasErrors && allFieldsFilled);
  };
  const validateField = (name, value) => {
    let errorMessage = "";

    if (name.includes("name")) {
      if (!value.trim()) {
        errorMessage = "Name is required";
      } else if (value.length < 3) {
        errorMessage = "Name must be at least 3 characters";
      } else if (value.length > 20) {
        errorMessage = "Name cannot exceed 20 characters";
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        errorMessage = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMessage = "Enter a valid email address";
      }
    }

    if (name === "title") {
      if (!value.trim()) {
        errorMessage = "Subject is required";
      } else if (value.length < 3) {
        errorMessage = "Subject must be at least 3 characters";
      }
    }

    if (name === "message") {
      if (!value.trim()) {
        errorMessage = "Message cannot be empty";
      } else if (value.length < 10) {
        errorMessage = "Message must be at least 10 characters";
      }
    }

    // Update errors state
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));

    // Recalculate form validity
    checkFormValidity({ ...formData, [name]: value }, errorMessage);
  };


  // Handle form input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseHtml(value)});
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Validate all fields and collect errors in local state
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      let errorMessage = "";

      if (!value.trim()) {
        errorMessage = "This field is required";
      } else {
        if (key === "name") {
      if (value.length < 3) errorMessage = "Name must be at least 3 characters";
      if (value.length > 20) errorMessage = "Name cannot exceed 20 characters";
    }
    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMessage = "Enter a valid email address";
    }
    if (key === "title" && value.length < 3) {
      errorMessage = "Subject must be at least 3 characters";
    }
    if (key === "message" && value.length < 10) {
      errorMessage = "Message must be at least 10 characters";
    }
  }

  if (errorMessage) {
    newErrors[key] = errorMessage; // Store error in local object
  }
});

// Update the errors state once at the end
setErrors(newErrors);

// If there are errors, prevent form submission
if (Object.keys(newErrors).length > 0) {
  onFailure({
    message: "Validation Error",
    error: "Please correct the highlighted errors before submitting.",
  });
  return;
}

setLoading(true);

try {
  const response = await client.post(`/contact`, formData);
  console.log(response)
  if (!response?.data?.message?.includes("successfully")) throw new Error("Failed to submit the form. Please try again.");

  onSuccess({ message: "Form Submission", success: "Message sent successfully!" });

  // Reset form after success
  setFormData({ name: "", email: "", subject: "", message: "" });
  setErrors({});
  setIsFormValid(false);
} catch (error) {
  onFailure({ message: "Submission Error", error: error?.message || "Something went wrong." });
} finally {
  setLoading(false);
}
  };



return (
  <>
    {variant === "compact" ? (
      <>
        <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
        <p className="text-gray-500">You can reach us anytime</p>
        <form className="mt-3 text-left" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            {/* First Name */}
            <div className="w-full">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name || ""}
                onChange={handleChange}
                className={`w-full p-3 border rounded-full ${errors.name ? "border-red-500" : formData.name ? "border-green-500" : "border-gray-400"
                  }`}
              />
              <p className={`text-sm ${errors.name ? "text-red-500" : "text-green-500"}`}>
                {errors.name || (formData.name ? "✓ Looks good!" : "")}
              </p>
            </div>
            <div className="w-full">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 p-3 border rounded-full ${errors.email ? "border-red-500" : formData.email ? "border-green-500" : "border-gray-400"}`}
                />
              
              <p className={`text-sm ${errors.email ? "text-red-500" : "text-green-500"}`}>
                {errors.email || (formData.email ? "✓ Looks good!" : "")}
              </p>
            </div>
          </div>


            <div className=" w-full mt-4">
              <input
                type="text"
                name="title"
                placeholder="Subject"
                value={formData.title}
                onChange={handleChange}
                className={`w-full pl-5 p-3 border rounded-full ${errors.title ? "border-red-500" : formData.title ? "border-green-500" : "border-gray-400"
                  }`}
              />
              <p className={`text-sm ${errors.title ? "text-red-500" : "text-green-500"}`}>
                {errors.title || (formData.title ? "✓ Looks good!" : "")}
              </p>
            </div>

          <div className="mt-4">
            <textarea
              name="message"
              placeholder="How can we help?"
              maxLength={200}
              value={formData.message}
              onChange={handleChange}
              className={`w-full p-3 border rounded-2xl ${errors.message ? "border-red-500" : formData.message ? "border-green-500" : "border-gray-400"
                }`}
              rows="4"
            ></textarea>
            <p className={`text-sm ${errors.message ? "text-red-500" : "text-green-500"}`}>
              {errors.message || (formData.message ? "✓ Looks good!" : "")}
            </p>
          </div>

          <button type="submit" className="w-full font-medium bg-green-600 text-white py-3 mt-4 rounded-full hover:bg-green-700 flex items-center justify-center gap-2 transition-all duration-200">
            Submit {loading && <FaSpinner className="animate-spin" />}
          </button>
        </form>

      </>
    ) : (
      <div className="py-10 px-6 bg-white w-[90%] border rounded mx-auto">
        <h3 className="text-xl font-semibold mb-6">Leave A Message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : formData.name ? "border-green-500" : "border-gray-300"}`} />
              <p className={`text-sm ${errors.name ? "text-red-500" : "text-green-500"}`}>
                {errors.name || (formData.name ? "✓ Looks good!" : "")}
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : formData.email ? "border-green-500" : "border-gray-300"}`} />
              <p className={`text-sm ${errors.email ? "text-red-500" : "text-green-500"}`}>
                {errors.email || (formData.email ? "✓ Looks good!" : "")}
              </p>
            </div>
          </div>
          <div>
            <input type="text" name="title" placeholder="Subject" value={formData.title} onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.title ? "border-red-500" : formData.title ? "border-green-500" : "border-gray-300"}`} />
            <p className={`text-sm ${errors.title ? "text-red-500" : "text-green-500"}`}>
              {errors.title || (formData.title ? "✓ Looks good!" : "")}
            </p>
          </div>
          <div>
            <textarea name="message" placeholder="Comment" rows="4" value={formData.message} onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.message ? "border-red-500" : formData.message ? "border-green-500" : "border-gray-300"}`} />
            <p className={`text-sm ${errors.message ? "text-red-500" : "text-green-500"}`}>
              {errors.message || (formData.message ? "✓ Looks good!" : "")}
            </p>
          </div>
          <button disabled={loading} type="submit"
            className="bg-green-600 text-white py-3 px-8 rounded hover:bg-green-700 flex justify-center items-center gap-2 transition-all duration-200">
            Send Message {loading && <FaSpinner className="animate-spin" />}
          </button>
        </form>
      </div>
    )}
  </>
);
};

export default ContactForm;
