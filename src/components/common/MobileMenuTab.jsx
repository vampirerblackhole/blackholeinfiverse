import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./MobileMenuTab.module.css";

const MobileMenuTab = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.split("/")[1] || "home"
  );

  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "explore", icon: "🔍", label: "Explore" },
    { id: "create", icon: "➕", label: "Create" },
    { id: "activity", icon: "❤️", label: "Activity" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className={styles.mobileMenuContainer}>
      <div className={styles.mobileMenu}>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={`/${tab.id}`}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className={styles.icon}>{tab.icon}</span>
            <span className={styles.label}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileMenuTab;
