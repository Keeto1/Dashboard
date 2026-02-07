import React, { useState } from "react";
import "./Header.css";
import { useAuth } from "../../../context/AuthContext"; // correct path

const Header = ({ onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { user, logout } = useAuth(); // real authenticated user

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      alert(`Searching for: ${searchTerm}`);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowMenu(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="header-title">Dashboard</h1>
      </div>

      <div className="header-right">
        <form className="search-bar" onSubmit={handleSearch} role="search">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search"
          />
          <button className="search-icon" type="submit" aria-label="Submit search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Notifications"
            onClick={handleNotificationClick}
          >
            <svg width="20" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <h3>Notifications</h3>
              <div className="notification-item">
                <p><strong>New User</strong></p>
                <p>Sarah joined the team</p>
                <span>5 min ago</span>
              </div>
              <div className="notification-item">
                <p><strong>Payment Received</strong></p>
                <p>$1,250 received</p>
                <span>1 hour ago</span>
              </div>
            </div>
          )}

          {/* ------------------ AUTH USER ------------------ */}
          <div
            className="user-profile"
            onClick={() => {
              setShowMenu(!showMenu);
              setShowNotifications(false);
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="user-avatar">
              {getInitials(user?.name)}
            </div>

            <span className="user-name">
              {user?.name || "Unknown User"}
            </span>

            {showMenu && (
              <div className="user-menu">
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
