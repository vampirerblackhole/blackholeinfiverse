import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ComingSoon from "./ComingSoon";
import LoaderBeforeSite from "../../../../components/LoaderBeforeSite";
import { useTranslation } from "../../../../hooks/useTranslation";
import "./ComingSoonPage.css";

const ComingSoonPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const { t } = useTranslation();
  const progressIntervalRef = useRef(null);
  const navigationTimeoutRef = useRef(null);
  const destinationPathRef = useRef(null);

  // Immediately hide the blackhole on mount
  useEffect(() => {
    const blackholeContainer = document.querySelector(
      ".blackhole-container-override"
    );
    if (blackholeContainer) {
      // Save the original style to restore on unmount
      const originalOpacity = blackholeContainer.style.opacity;
      const originalVisibility = blackholeContainer.style.visibility;

      // Hide immediately
      blackholeContainer.style.opacity = "0";
      blackholeContainer.style.visibility = "hidden";

      return () => {
        // Restore original styles only if we're not going back
        if (!loading) {
          blackholeContainer.style.opacity = originalOpacity;
          blackholeContainer.style.visibility = originalVisibility;
        }
      };
    }
  }, [loading]);

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

    // Clean up on unmount
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [location.state]);

  const handleGoHome = () => {
    // First, immediately hide the blackhole
    const blackholeContainer = document.querySelector(
      ".blackhole-container-override"
    );
    if (blackholeContainer) {
      blackholeContainer.style.opacity = "0";
      blackholeContainer.style.visibility = "hidden";
      blackholeContainer.style.display = "none"; // Even more aggressive hiding
      blackholeContainer.style.pointerEvents = "none";
    }

    // Also try to hide any other background elements that might flash
    document
      .querySelectorAll(
        ".stars-container-override, .webgl, .blackhole-canvas-override"
      )
      .forEach((el) => {
        if (el) {
          el.style.opacity = "0";
          el.style.visibility = "hidden";
        }
      });

    // Set a reference to where we want to navigate to
    destinationPathRef.current = -1;

    // Start loading
    setLoading(true);

    // Start a controlled progress animation that ensures we reach 100%
    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += 10; // Faster progress

      if (progress >= 100) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setLoadProgress(progress);
    }, 30); // Even faster interval
  };

  const handleLoadingComplete = () => {
    // Add a small delay before navigating to ensure transitions are complete
    navigationTimeoutRef.current = setTimeout(() => {
      // Make one final check to ensure blackhole is hidden before navigation
      const blackholeContainer = document.querySelector(
        ".blackhole-container-override"
      );
      if (blackholeContainer) {
        blackholeContainer.style.opacity = "0";
        blackholeContainer.style.visibility = "hidden";
        blackholeContainer.style.display = "none";
      }

      // Navigate to the destination
      if (destinationPathRef.current !== null) {
        navigate(destinationPathRef.current);
      }
    }, 50); // Shorter delay
  };

  if (!game) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <>
      {loading && (
        <LoaderBeforeSite
          onLoadingComplete={handleLoadingComplete}
          progress={loadProgress}
        />
      )}

      <div className="coming-soon-page" style={{ opacity: loading ? 0 : 1 }}>
        <ComingSoon game={game} />
        <button
          type="button"
          onClick={handleGoHome}
          className="back-button"
          disabled={loading}
        >
          <ArrowLeft size={24} />
        </button>
      </div>
    </>
  );
};

export default ComingSoonPage;
