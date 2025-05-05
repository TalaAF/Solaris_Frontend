<<<<<<< HEAD
import React from "react";
import { NavLink } from "react-router-dom";
import { List } from "@mui/material";
=======
import React from 'react';
import { NavLink } from 'react-router-dom';
import { List } from '@mui/material';
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
import {
  Home,
  Book,
  Calendar,
  FileText,
  MessageSquare,
  Stethoscope,
  BarChart2,
<<<<<<< HEAD
  Users,
} from "lucide-react";
import "./Sidebar.css";
=======
  Users
} from 'lucide-react';
import './Sidebar.css';
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2

// Remove the onToggle prop since we'll control it from Layout
const Sidebar = ({ isOpen }) => {
  const navigationItems = [
<<<<<<< HEAD
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
=======
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} />, iconClass: 'icon-home' },
    { name: 'Courses', path: '/courses', icon: <Book size={20} />, iconClass: 'icon-book' },
    { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} />, iconClass: 'icon-calendar' },
    { name: 'Resources', path: '/resources', icon: <FileText size={20} />, iconClass: 'icon-file' },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} />, iconClass: 'icon-message-square' },
    { name: 'Clinical Skills', path: '/clinical-skills', icon: <Stethoscope size={20} />, iconClass: 'icon-stethoscope' },
    { name: 'Progress', path: '/progress', icon: <BarChart2 size={20} />, iconClass: 'icon-bar-chart-2' },
    { name: 'Community', path: '/community', icon: <Users size={20} />, iconClass: 'icon-users' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <List className="nav-menu">
        {navigationItems.map(item => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
          >
            <div className={`nav-icon ${item.iconClass}`}></div>
            <span className="nav-label">{item.name}</span>
          </NavLink>
        ))}
      </List>
<<<<<<< HEAD

=======
      
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
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
