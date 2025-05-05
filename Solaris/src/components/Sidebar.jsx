import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "home" },
    { path: "/courses", label: "Courses", icon: "book" },
    { path: "/calendar", label: "Calendar", icon: "calendar" },
    { path: "/assessments", label: "Assessments", icon: "file" },
    { path: "/collaboration", label: "Collaboration", icon: "message-square" },
    { path: "/clinical-skills", label: "Clinical Skills", icon: "stethoscope" },
    { path: "/progress", label: "Progress", icon: "bar-chart-2" },
    { path: "/community", label: "Community", icon: "users" },
  ];

  return (
    <div className="sidebar">
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className={`nav-icon icon-${item.icon}`}></span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="help-section">
        <h3>Need Help?</h3>
        <p>Access our support center or contact technical support.</p>
        <button className="support-button">Get Support →</button>
      </div>
    </div>
  );
};

export default Sidebar;
