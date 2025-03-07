import React, { useEffect, useState } from "react";
import Navbar from "../components/Landing/Navbar";
import SectionHeader from "../components/Landing/SectionHeader";
import ContentList from "../components/Landing/ContentList";
import ContactInfo from "../components/Landing/ContactInfo";
import Footer from "../components/Landing/Footer";
import termsImg from "../assets/pngs/terms.png";
import termsData from "./terms.json"; // Import the JSON data
import { Helmet } from "react-helmet";
const TermsConditions = () => {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    // Load terms from JSON
    setTerms(termsData.terms);
  }, []);

  return (
    <>
      <Helmet>
        <title>Mayrahkee | Terms & Conditions</title>
      </Helmet>
      <SectionHeader
        title="Terms & Conditions for MayrahkeeAfrica"
        img={termsImg}
      />
      <div className="relative max-w-[1400px] w-full mx-auto">
        <Navbar />
        <div className="relative px-5 h-auto flex flex-col gap-3">

          <div className="container mx-auto p-4 space-y-8">
            <p className="text-gray-500 text-sm">
              <strong>Last Updated:</strong> {termsData.lastUpdated}
            </p>
            {terms.map((term, index) => (
              <section key={index}>
                <h2 className="text-xl font-bold">{`${index + 1}. ${term.section}`}</h2>
                <p className="text-gray-700">{term.content}</p>
                {term.list && <ContentList items={term.list} />}
                {term.contactDetails && (
                  <div>
                    <p>
                      <strong>Email:</strong> {term.contactDetails.email}
                    </p>
                    <p>
                      <strong>Address:</strong> {term.contactDetails.address}
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsConditions;
