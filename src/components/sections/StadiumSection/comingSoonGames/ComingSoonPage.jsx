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
  }, [location.state]);

  const handleGoHome = () => {
    // Use navigate instead of window.location for SPA navigation
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
