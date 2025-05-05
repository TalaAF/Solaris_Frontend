import React from "react";
import { NavLink } from "react-router-dom";
import { List } from "@mui/material";
import {
  Home,
  Book,
  Calendar,
  FileText,
  MessageSquare,
  Stethoscope,
  BarChart2,
  Users,
  GraduationCap, // Added for enrollment icon
} from "lucide-react";
import "./Sidebar.css";

// Remove the onToggle prop since we'll control it from Layout
const Sidebar = ({ isOpen }) => {
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home size={20} />,
      iconClass: "icon-home",
    },
    {
      name: "Courses",
      path: "/courses",
      icon: <Book size={20} />,
      iconClass: "icon-book",
    },
    {
      name: "Enrollment", // New Enrollment item
      path: "/enrollment",
      icon: <GraduationCap size={20} />,
      iconClass: "icon-graduation-cap",
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: <Calendar size={20} />,
      iconClass: "icon-calendar",
    },
    {
      name: "Resources",
      path: "/resources",
      icon: <FileText size={20} />,
      iconClass: "icon-file",
    },
    {
      name: "Messages",
      path: "/messages",
      icon: <MessageSquare size={20} />,
      iconClass: "icon-message-square",
    },
    {
      name: "Clinical Skills",
      path: "/clinical-skills",
      icon: <Stethoscope size={20} />,
      iconClass: "icon-stethoscope",
    },
    {
      name: "Progress",
      path: "/progress",
      icon: <BarChart2 size={20} />,
      iconClass: "icon-bar-chart-2",
    },
    {
      name: "Community",
      path: "/community",
      icon: <Users size={20} />,
      iconClass: "icon-users",
    },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <List className="nav-menu">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <div className={`nav-icon ${item.iconClass}`}></div>
            <span className="nav-label">{item.name}</span>
          </NavLink>
        ))}
      </List>
      {isOpen && (
        <div className="help-section">
          <h3>Need Help?</h3>
          <p>Access our support center or contact technical support.</p>
          <button className="support-button">Get Support →</button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;