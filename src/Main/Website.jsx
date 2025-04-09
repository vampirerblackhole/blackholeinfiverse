// import React from "react";
// import StarsCanvas from '../../main/StarBackground'
import BHI from "../component/BHI/BH";
import Main from "../component/Robotics/Main";
import Main2 from "../component/Gaming/Main2";
import BlackholeScene from "../component/Blackhole/BlackholeScene";
import Stars from "../component/Stars/Stars";
// import Navbar from "../Navbar/Navbar";
// import Main3 from "../component/Ai/Main3";
// import BlackholeContainer from "../component/Blackhole/BlackholeContainer";
// import Exp from '../component/shaders/Exp'

function Website() {
  return (
    <>
      {/* Background layers */}
      <Stars />
      <BlackholeScene />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          zIndex: 1,
          background: "transparent",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            pointerEvents: "auto",
            background: "transparent",
          }}
        >
          {/* Display BHI component first */}
          <BHI />

          {/* Then display robotics and gaming sections */}
          <Main />
          <Main2 />
        </div>
      </div>
    </>
  );
}

export default Website;
