import { Suspense } from "react";
import BlackholeSideText from "../component/sections/BlackholeSection/BlackholeSideText";
import Main from "../component/sections/RobotSection/Main";
import Main2 from "../component/sections/StadiumSection/Main2";
import BlackholeScene from "../component/sections/BlackholeSection/BlackholeScene";

function Website() {
  return (
    <>
      {/* Background layers */}
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
          <Suspense fallback={<div>Loading...</div>}>
            {/* Display BlackholeSideText component first */}
            <BlackholeSideText />

            {/* Then display robotics and gaming sections */}
            <Main />
            <Main2 />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default Website;
