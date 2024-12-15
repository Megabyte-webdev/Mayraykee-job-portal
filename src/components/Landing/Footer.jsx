// Footer.jsx
import React from "react";
import logo from '../../assets/pngs/mayrakee-icon.png'
import { TiSocialFacebookCircular, TiSocialInstagram } from 'react-icons/ti'
import { RiLinkedinBoxLine } from 'react-icons/ri'
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-green-600 text-white py-6 mt-10" style={{ backgroundImage: "linear-gradient(to top, rgba(15, 90, 2, 0.89), rgba(71, 170, 73, 0.9))" }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 w-[95%] max-w-[1400px] mx-auto">
        {/* Logo and Company Info */}
        <div className="mb-6 md:mb-0 flex flex-col">
          <img src={logo} alt="logo" className="w-32 md:w-48 my-2" />
          <p className="text-sm my-2">6<sup>th</sup> floor, NICON Plaza 242 Muhammadu Buhari Way,<br/> Central Business District, Abuja.</p>
          <a className="text-sm my-2" href="mailto:support@mayraykeeafrica.com">support@mayraykeeafrica.com</a>
          <a className="text-sm my-2" href="tel:+2348078874748">+234(0)807 887 4748</a>
          
        </div>

        {/* Links Section */}
        <div className="md:ml-auto flex flex-col md:flex-row gap-8 text-sm">
          <div>
            <h2 className="font-semibold mb-2">Company</h2>
            <ul>
              <li className="mb-1"><Link to="/about" className="hover:underline">About Us</Link></li>
              <li className="mb-1"><a href="/faq" className="hover:underline">FAQ</a></li>
              <li className="mb-1"><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              <li className="mb-1"><Link to="/" className="hover:underline">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Legal</h2>
            <ul>
              <li className="mb-1"><a href="/terms&conditions" className="hover:underline">Terms & Conditions</a></li>
              <li className="mb-1"><a href="/privacypolicy" className="hover:underline">Privacy Policy</a></li>
              <li className="mb-1"><a href="#faq" className="hover:underline">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className=" mt-6 border-t border-white pt-4 flex flex-wrap justify-center md:justify-between w-[95%] md:max-w-[1400px] mx-auto"
        style={{ borderImageSource: "linear-gradient(to left, rgba(102, 102, 102, 0.05), #FFFFFF, rgba(102, 102, 102, 0.05))", borderImageSlice: "1 0 1 0", borderImageRepeat: "stretch", borderTop: "2px solid" }}>
        <p className="text-center text-sm">© 2024 Mayankee. All Rights Reserved.</p>
        {/* Social Media Links */}
        <div className="mt-6 md:mt-0 flex gap-4 text-white">
          <a href="#facebook" className="hover:scale-110 transition">
            <TiSocialFacebookCircular size="24" />
          </a>
          <a href="#twitter" className="hover:scale-110 transition">
            <TiSocialInstagram size="24" />
          </a>
          <a href="#linkedin" className="hover:scale-110 transition">
            <RiLinkedinBoxLine size="24" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
