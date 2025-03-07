import Banner from '../components/Landing/Banner';
import Footer from '../components/Landing/Footer';
import Navbar from '../components/Landing/Navbar';
import Empowering from '../components/Landing/Empowering';
import OurValue from '../components/Landing/OurValue';
import InfoSection from '../components/Landing/InfoSection';
import tunnel from '../assets/pngs/Tunnel2.png'
import missionImg from '../assets/pngs/about3.png'
import visionImg from '../assets/pngs/about4.png'
import { Helmet } from "react-helmet";
const AboutUs = () => {
    window.scrollTo(0, 0)
    return (
        <>
            <Helmet>
                <title>Mayrahkee | About</title>
            </Helmet>
            <div className='relative max-w-[1400px] w-full mx-auto'
                style={{
                    backgroundImage: `linear-gradient(rgba(250,250,250,.6), rgba(250,250,250,.6)), url(${tunnel})`,
                    backgroundPosition: 'center',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: "overlay",
                    backgroundAttachment: "fixed"
                }}>
                <Navbar />
                <main className="relative my-20 px-5 h-auto flex flex-col gap-5 items-center">
                    <Banner title="About Us" desc="Connecting talent to opportunities with integrity and innovation." />
                    <Empowering />
                    <InfoSection
                        title="Our Mission"
                        description="To be the preferred customer’s first choice in our carefully selected markets where we create value for all stakeholders through business opportunities as well as re-orientating our thinking towards skills, capacity building and talent development."
                        buttonText="Get Started Now"
                        imageSrc={missionImg}
                        reverse={false}
                    />
                    <InfoSection
                        title="Vision Statement"
                        description="To be an integrated and customer-centric African company that creates business opportunities built on creative thinking, fostering talent development and capacity building towards a sustainable future in an evolving landscape.​"
                        buttonText="Get Started Now"
                        imageSrc={visionImg}
                        reverse={true}
                    />
                    <div className="max-w-[1200px]" >
                        <OurValue />
                    </div>
                </main>
            </div>
            <Footer />
        </>
    )
}

export default AboutUs;