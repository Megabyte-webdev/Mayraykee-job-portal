import React from "react";
import { FiMail, FiPhone } from "react-icons/fi"; // Import icons
import Navbar from '../components/Landing/Navbar'
import Footer from '../components/Landing/Footer'
import LocationSection from '../components/Landing/LocationSection'
const ContactUs = () => {
  return (
    <>
      <div className='relative max-w-[1400px] w-full mx-auto'>
        <Navbar />
        <main className="relative my-24 px-5 h-full">

          {/* Contact Info & Form Section */}
          <div className="flex flex-wrap justify-center md:justify-between gap-8 px-4">
            {/* Contact Information */}
            <div className="flex-2 w-full md:w-3/5">
              {/* Header Section */}
              <h1 className="text-center text-3xl font-bold py-5">Contact Us</h1>
              <p className="text-gray-600 mt-2 font-medium ext-sm">
                Email, call or complete the form to learn how Mayrahkee Africa can be of help to you.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div>
                  <h2 className="font-bold capitalize">General inquiries</h2>
                  <a className="text-gray-600" href="mailto:Info@mayrahkeeafrica.com" >info@mayrahkeeafrica.com</a> <br/>
                  <a className="text-gray-600" href="tel:08078874748" >0807 887 4748</a>
                </div>
                <div>
                  <h2 className="font-bold capitalize">technical support </h2>
                  <p className="text-gray-600">support@mayrahkeeafrica.com</p>
                </div>
                <div>
                  <h2 className="font-bold capitalize">feedback & suggestions</h2>
                  <p className="text-gray-600">feedbacks@mayrahkeeafrica.com</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex-1 text-center w-2/5 min-w-[300px p-6 rounded-2xl border border-gray-400">
              <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
              <p className="text-gray-500">You can reach us anytime</p>
              <form className="mt-3">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full p-3 border border-gray-400 placeholder:text-gray-400 text-sm font-medium rounded-full"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full p-3 border border-gray-400 placeholder:text-gray-400 text-sm font-medium rounded-full"
                  />
                </div>
                <div className="relative w-full mt-4">
                  <FiMail className="absolute left-4 top-0 bottom-0 my-auto text-gray-400" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full pl-10 p-3 border border-gray-400 placeholder:text-gray-400 text-sm font-medium rounded-full"
                  />
                </div>
                <div className="relative w-full mt-4">
                  <FiPhone className="absolute left-4 top-0 bottom-0 my-auto text-gray-400" />
                  <input
                    type="text"
                    placeholder="Your phone number"
                    className="w-full pl-10 p-3 border border-gray-400 placeholder:text-gray-400 text-sm font-medium rounded-full"
                  />
                </div>
                <textarea
                  placeholder="How can we help?"
                  maxLength={200}
                  className="w-full p-3 mt-4 border rounded-2xl border-gray-400 placeholder:text-gray-400 text-sm font-medium"
                  rows="4"
                ></textarea>
                <button
                  type="submit"
                  className="w-full font-medium bg-green-600 text-white py-3 mt-4 rounded-full hover:bg-green-700"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          <LocationSection />

        </main>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default ContactUs;
