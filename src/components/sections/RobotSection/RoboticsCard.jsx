import TiltCard from "../../common/TiltCard";
import PropTypes from "prop-types";
import { useTranslation } from "../../../hooks/useTranslation";

const RoboticsCard = ({ title, description, style }) => {
  const { t } = useTranslation();

  return (
    <>
      <TiltCard
        title={title || t('robotics.welcomeTitle')}
        description={
          description || t('robotics.welcomeDescription')
        }
        style={style}
      />
      <style>
        {`
          @media (max-width: 768px) {
            .section .para2,
            .section .para2-left,
            .section .para3 {
              position: relative !important;
              z-index: 30 !important;
              width: 90% !important;
              margin: 0 auto !important;
              left: 0 !important;
              right: 0 !important;
              top: auto !important;
              padding: 1rem !important;
              height: auto !important;
            }
            
            .section .para2 > div,
            .section .para2-left > div,
            .section .para3 > div {
              width: 100% !important;
              height: auto !important;
            }
            
            .section .para2 .card,
            .section .para2-left .card,
            .section .para3 .card {
              height: auto !important;
              min-height: auto !important;
              aspect-ratio: auto !important;
              display: flex !important;
              flex-direction: column !important;
            }
            
            .section .para2 .description,
            .section .para2-left .description,
            .section .para3 .description {
              width: 100% !important;
              max-width: 100% !important;
            }
          }
          
          @media (max-width: 480px) {
            .section .para2,
            .section .para2-left,
            .section .para3 {
              width: 95% !important;
            }
          }
        `}
      </style>
    </>
  );
};

RoboticsCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object,
};

export default RoboticsCard;
