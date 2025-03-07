import React, { useEffect, useState } from "react";
import Navbar from "../components/Landing/Navbar";
import SectionHeader from "../components/Landing/SectionHeader";
import ContentList from "../components/Landing/ContentList";
import ContactInfo from "../components/Landing/ContactInfo";
import Footer from "../components/Landing/Footer";
import privacy from "../assets/pngs/privacy.png";
import privacyPolicyData from "./privacy.json"; // Import the JSON data
import { Helmet } from "react-helmet";
const PrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState([]);

  useEffect(() => {
    // Load privacy policy from JSON
    setPrivacyPolicy(privacyPolicyData.privacyPolicy);
  }, []);

  return (
    <>
      <Helmet>
        <title>Mayrahkee | Privacy Policy</title>
      </Helmet>
      <SectionHeader
        title="Privacy Policy for MayrahkeeAfrica"
        img={privacy}
      />
      <div className="relative max-w-[1400px] w-full mx-auto">
        <Navbar />
        <div className="relative my-20 px-5 h-auto flex flex-col gap-3">

          <div className="container mx-auto p-4 space-y-8">
            <p className="text-gray-500 text-sm">
              <strong>Last Updated:</strong> {privacyPolicyData.lastUpdated}
            </p>
            {privacyPolicy.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-bold">{`${index + 1}. ${section.section}`}</h2>
                <p className="text-gray-700">{section.content}</p>
                {section.list && <ContentList items={section.list} />}
                {section.contactDetails && (
                  <div>
                    <p>
                      <strong>Email:</strong> {section.contactDetails.email}
                    </p>
                    <p>
                      <strong>Address:</strong> {section.contactDetails.address}
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

export default PrivacyPolicy;
