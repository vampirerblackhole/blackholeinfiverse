import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import ComingSoon from "./ComingSoon";
import "./ComingSoonPage.css";

const ComingSoonPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);

  useEffect(() => {
    // Get game data from location state
    if (location.state?.game) {
      setGame(location.state.game);
    } else {
      // Fallback if no game data is provided
      setGame({
        title: "Coming Soon",
        description: "This game will be available soon!",
        image: "/images/games/default-game.jpg",
      });
    }

    // Set body to dark background as fallback
    document.body.style.backgroundColor = "#000";

    // Force refresh of stars visibility
    try {
      // Try to refresh the global stars
      const appContainer = document.querySelector(".App");
      if (appContainer) {
        const starsContainer = appContainer.querySelector(
          ".stars-container-override"
        );
        if (starsContainer) {
          console.log("Found stars container, adjusting visibility");
          starsContainer.style.opacity = "1";
          starsContainer.style.zIndex = "0";
        }
      }
    } catch (e) {
      console.error("Error accessing stars:", e);
    }
  }, [location.state]);

  const handleGoHome = () => {
    navigate("/");
  };

  if (!game) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="coming-soon-page">
      <ComingSoon game={game} />
      <button type="button" onClick={handleGoHome} className="back-button">
        <Home size={24} />
      </button>
    </div>
  );
};

export default ComingSoonPage;
