// import React from "react";
// import StarsCanvas from '../../main/StarBackground'
import BHI from "../component/BHI/BH";
import Main from "../component/Robotics/Main";
import Main2 from "../component/Gaming/Main2";
// import Navbar from "../Navbar/Navbar";
// import Main3 from "../component/Ai/Main3";
// import BlackholeContainer from "../component/Blackhole/BlackholeContainer";
// import Exp from '../component/shaders/Exp'

function Website() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        zIndex: 10,
        background: "transparent",
      }}
    >
      {/* Content with higher z-index to appear above the stars */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
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
  );
}

export default Website;
