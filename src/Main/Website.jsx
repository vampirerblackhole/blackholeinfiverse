import { Suspense } from "react";
import BlackholeSideText from "../component/sections/BlackholeSection/BlackholeSideText";
import Main from "../component/sections/RobotSection/Main";
import Main2 from "../component/sections/StadiumSection/Main2";
import BlackholeScene from "../component/sections/BlackholeSection/BlackholeScene";
import LoadingAnimation from "../component/LoaderBeforeSite";

function Website() {
  return (
    <>
      {/* Background Scene */}
      <BlackholeScene />

      {/* Main Content */}
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
          <Suspense fallback={<LoadingAnimation />}>
            {/* BlackholeSideText Section */}
            <BlackholeSideText />

            {/* Robot Section */}
            <Main />

            {/* Stadium Section */}
            <Main2 />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default Website;
