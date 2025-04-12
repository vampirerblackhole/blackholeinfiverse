import { Suspense, useState, useEffect } from "react";
import BlackholeSideText from "../component/sections/BlackholeSection/BlackholeSideText";
import Main from "../component/sections/RobotSection/Main";
import Main2 from "../component/sections/StadiumSection/Main2";
import BlackholeScene from "../component/sections/BlackholeSection/BlackholeScene";

function Website() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="relative min-h-screen w-full">
        {/* Background Scene */}
        <BlackholeScene />
        {/* BlackholeSideText Section */}
        <BlackholeSideText />
        {/* Robot Section */}
        <Main />
        {/* Stadium Section */}
        <Main2 />
      </div>
    </div>
  );
}

export default Website;
