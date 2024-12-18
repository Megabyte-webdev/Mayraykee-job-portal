import React from 'react';
import { useState } from "react";
import telephone from '../assets/smartphone.jpg'
import email from '../assets/email.jpg'
import location from '../assets/image-address.jpg'
import logo from '../assets/Mayrahkee_Africa_Logo_White.png'
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';
const Help = () => {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };
  window.scrollTo(0, 0);
  return (
    <>
      <div className='relative max-w-[1400px] w-full mx-auto'>
        <Navbar />
        <div className="relative my-20 px-5 h-auto flex flex-col gap-3">

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-75">
              <span className="text-xl font-semibold">Loading...</span>
            </div>
          )}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.902209623298!2d7.492578774728237!3d9.066242988074365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0aacaa3e08c1%3A0xd8f86cb7f35f8c5a!2sNICON%20Plaza%2C%20Abuja!5e0!3m2!1sen!2sng!4v1699588764189!5m2!1sen!2sng"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Location Map"
            className="w-full"
            onLoad={handleLoad}
          ></iframe>
        </div>

        {/* Contact Information */}
        <div className="py-10 px-6 text-center grid grid-cols-1 sm:grid-cols-3 gap-6 justify-center">
          <div className="flex flex-col items-center" >
            <img src={location} className="w-30 my-2" />
            <h3 className="font-semibold text-black text-xl">Address</h3>
            <p className="text-gray-500 font-bold text-sm capitalize">6<sup>th</sup> floor, NICON Plaza 242 Muhammadu Buhari Way,<br/> Central Business District, Abuja.</p>
          </div>
          <div className="flex flex-col items-center">
            <img src={telephone} className="w-30 my-2" />
            <h3 className="font-semibold text-black text-xl">Call Us</h3>
            <p className="text-sm text-gray-500 font-bold">+234(0)807 887 4748</p>
          </div>
          <div className="flex flex-col items-center">
            <img src={email} className="w-30 my-2" />
            <h3 className="font-semibold text-gray-700 text-xl">Email</h3>
            <p className="text-sm text-gray-500 font-bold">support@mayrahkeeafrica.com</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="py-10 px-6 bg-white w-[90%] border rounded mx-auto">
          <h3 className="text-xl font-semibold mb-6">Leave A Message</h3>
          <form className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row">
              <input
                type="text"
                placeholder="Name"
                required
                className="bg-gray-50 w-full md:w-1/2 p-2 border rounded"
              />
              <input
                type="email"
                required
                placeholder="Email"
                className="bg-gray-50 w-full md:w-1/2 p-2 border rounded"
              />
            </div>
            <input
              type="text"
              required
              placeholder="Subject"
              className="bg-gray-50 w-full p-2 border rounded"
            />
            <textarea
              placeholder="Comment"
              rows="4"
              className="bg-gray-50 w-full p-2 border rounded"
            ></textarea>
            <button
              type="submit"
              className="bg-green-600 text-white py-3 px-8 rounded hover:bg-green-700"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Recruiting Section */}
        <div className="w-[90%] mx-auto p-8 bg-blue-100 mt-6 border rounded">
          <h3 className="text-xl text-gray-800 font-semibold mb-2">Recruiting?</h3>
          <p className="text-gray-600 mb-4 max-w-96">Advertise your jobs to millions of monthly users and search 15.8 million CVs in our database.</p>
          <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            Start Recruiting Now
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default React.memo(Help);
