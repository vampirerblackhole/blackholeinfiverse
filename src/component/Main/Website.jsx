import BlackholeSideText from "../../component/sections/BlackholeSection/BlackholeSideText";
import Main from "../../component/sections/RobotSection/Main";
import Main2 from "../../component/sections/StadiumSection/Main2";
import BlackholeScene from "../../component/sections/BlackholeSection/BlackholeScene";

function Website() {
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
