import TiltCard from "../../common/TiltCard";
import PropTypes from "prop-types";

const RoboticsCard = ({ title, description, style }) => {
  return (
    <TiltCard
      title={title || "Welcome to BlackHole Infiverse!"}
      description={
        description ||
        "Our cutting-edge robotics division is pushing the boundaries of what's possible with advanced AI and mechanical engineering. We're creating intelligent machines that help solve real-world problems while advancing the field of robotics."
      }
      style={style}
    />
  );
};

RoboticsCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object,
};

export default RoboticsCard;
