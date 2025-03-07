import React, { useEffect, useRef } from "react";
import profileViewer from "../assets/anim/profile-viewer.json";
//import searcherAnim from "../assets/anim/searcher-anim.json";
import Lottie from "lottie-react";
import mainLogoTwo from '../assets/pngs/main-logo-icon.png'

function FallbackComponent() {
  const lottieRef = useRef();


  useEffect(() => {
    if(lottieRef){

        lottieRef.current.setSpeed(1.5);
    }
  }, [lottieRef]);

  return (
    <main className="w-full h-screen bg-white/90 flex flex-col justify-center items-center">
      <Lottie
        lottieRef={lottieRef}
        // style={{ height: "25%" }}
        className="w-[40%] md:w-[25%]"
        animationData={profileViewer}
      />
      <img src={mainLogoTwo} className="w-[15%]"/>
    </main>
  );
}

export default FallbackComponent;
