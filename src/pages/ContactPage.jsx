import React from "react";
import { FiMail, FiPhone } from "react-icons/fi"; // Import icons
import Navbar from '../components/Landing/Navbar'
import Footer from '../components/Landing/Footer'
import LocationSection from '../components/Landing/LocationSection'
import ContactForm from "./ContactForm";
const ContactPage = () => {
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
              <div className="mt-6 flex flex-col gap-4">
                <div className="p-3">
                  <h2 className="font-bold capitalize">General inquiries</h2>
                  <a className="text-gray-600" href="mailto:Info@mayrahkeeafrica.com" >info@mayrahkeeafrica.com</a> <br/>
                  <a className="text-gray-600" href="tel:08078874748" >0807 887 4748</a>
                </div>
                <div className="p-3">
                  <h2 className="font-bold capitalize">technical support </h2>
                  <p className="text-gray-600">support@mayrahkeeafrica.com</p>
                </div>
                <div className="p-3">
                  <h2 className="font-bold capitalize">feedback & suggestions</h2>
                  <p className="text-gray-600">feedbacks@mayrahkeeafrica.com</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex-1 text-center w-2/5 min-w-[300px p-6 rounded-2xl border border-gray-400">
              <ContactForm variant="compact" />
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

export default ContactPage;
