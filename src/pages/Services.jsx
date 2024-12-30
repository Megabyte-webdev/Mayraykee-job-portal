import React from 'react';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';
import Banner from '../components/Landing/Banner';
import tunnel from '../assets/pngs/Tunnel2.png';
import basic from '../assets/exclusive.jpg';
import premium from '../assets/basic.jpg';
import classic from '../assets/classic.jpg';
import plus from '../assets/pluspackage.jpg';
import exclusive from '../assets/exclusive2.jpg';
const Services = () => {
    window.scrollTo(0, 0);

    const packages = [
        {
            name: "Basic",
            description: "Ideal for small-scale recruitment needs.",
            image: basic
        },
        {
            name: "Mayrahkee Classic",
            description: "A classic approach with more tailored options.",
            image: classic 
        },
        {
            name: "Mayrahkee Plus",
            description: "Enhanced recruitment and onboarding services.",
            image: plus
        },
        {
            name: "Mayrahkee Premium",
            description: "Comprehensive HR support and training included.",
            image: premium
        },
        {
            name: "Mayrahkee Exclusive",
            description: "Full-service recruitment for top-level positions.",
            image: exclusive 
        }
    ];

    return (
        <>
            <div 
                className="relative max-w-[1400px] w-full mx-auto"
                style={{
                    backgroundImage: `linear-gradient(rgba(250,250,250,.6), rgba(250,250,250,.6)), url(${tunnel})`,
                    backgroundPosition: 'center',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: "overlay",
                    backgroundAttachment: "fixed",
                }}
            >
                <Navbar />
                <main className="relative my-24 px-5 h-auto flex flex-col gap-10 items-center">
                    <Banner 
                        title="Our Services" 
                        desc="Providing world-class recruitment and capacity-building solutions tailored to your needs." 
                    />

                    {/* Recruitment Section */}
                    <section className="w-full bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-3xl font-bold text-green-600 mb-6">Recruitment</h2>
                        <p className="text-lg mb-4">
                            Our recruitment strategy and plans are properly defined and deployed to attract, hire, and onboard the right talents that complement our client’s (Employer) brand and culture proposition.
                        </p>
                        <p className="text-lg mb-4">
                            At Mayrahkee Africa, we do not just find the best fit; we offer the full package. We are an end-to-end result-oriented service provider. We strive to harness the partnerships' full potential, increase capacity, productivity, growth, and sustainability through cost-effective strategies for all stakeholders in the value chain.
                        </p>
                        <p className="text-lg mb-4">
                            In addition to providing our clients search results that meet their business and personal needs within the shortest possible period, the Mayrahkee Premium package avails subscribers the luxury of having a qualified Mayrahkee Africa team undertake the recruitment and onboarding processes while they sit back and oversee proceedings. 
                        </p>
                        <h3 className="text-xl font-semibold mb-3">HR Support Services Include:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Trainings in Value Education & Organizational Behaviour</li>
                            <li>Etiquette</li>
                            <li>Dress Code and Presence</li>
                            <li>Organizational Culture Enhancement</li>
                            <li>Microsoft Office Training</li>
                            <li>Basic Functional Administrative and Office Skills (360 Office Skills)</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-6 mb-3">Mayrahkee Africa Recruitment Portal:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>More Efficient Resume Search</li>
                            <li>Unmatched Quality of Applicants</li>
                            <li>Mindset Shift in Capacity Recruitment and Development</li>
                            <li>360° Smart Solution for Recruiting</li>
                            <li>Timely and Cost-Effective Services</li>
                            <li>Alignment with SDG Goals 1 and 8</li>
                        </ul>
                    </section>

                    {/* Packages Section */}
                    <section className="w-full max-w-[1200px]">
                        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Our Packages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {packages.map((pkg, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center text-center"
                                >
                                    <img 
                                        src={pkg.image} 
                                        alt={pkg.name} 
                                        className="w-20 h-20 mb-4 rounded-full object-cover"
                                    />
                                    <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                                    <p className="text-gray-700">{pkg.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Capacity Building Section */}
                    <section className="w-full max-w-[1200px] bg-gray-50 rounded-lg shadow-md p-6">
                        <h2 className="text-3xl font-bold text-green-600 mb-6">Capacity Building and Development</h2>
                        <p className="text-lg mb-4">
                            At Mayrahkee Africa, we are revolutionizing education through innovative e-learning solutions and hands-on physical training programs tailored to meet the needs of individuals, professionals, and organizations across Africa.
                        </p>
                        <p className="text-lg mb-4">
                            Our E-learning offerings make knowledge accessible and flexible, while our physical learning programs deliver practical experiences for well-rounded skill development.
                        </p>
                        <h3 className="text-xl font-semibold mb-3">Our Services:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Online Courses and Training</li>
                            <li>Virtual Learning Platforms</li>
                            <li>Custom Course Development</li>
                            <li>E-learning Consultation Services</li>
                            <li>Corporate Training and Upskilling</li>
                        </ul>
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default Services;
