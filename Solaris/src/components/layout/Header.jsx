<<<<<<< HEAD
import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="logo-container">
        <div className="logo-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </div>
        <span className="logo-text">Solaris</span>
      </div>

      <div className="header-icons">
        <button className="icon-button search-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
=======
import React, { useState } from "react";
import "./Header.css";
import NotificationsPanel from "./NotificationsPanel";
import Backdrop from "./Backdrop";
import NotificationBadge from "./NotificationBadge";
import { useNotifications } from "./NotificationContext";

const Header = () => {
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const toggleNotificationsPanel = () => {
    setNotificationsPanelOpen(!notificationsPanelOpen);
  };

  const closeNotificationsPanel = () => {
    setNotificationsPanelOpen(false);
  };

  return (
    <>
      <div className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </div>
          <span className="logo-text">Solaris</span>
        </div>

        <div className="header-icons">
          <button
            className="icon-button notification-button"
            onClick={toggleNotificationsPanel}
            aria-label="Open notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <NotificationBadge count={unreadCount} />
          </button>

          <button className="icon-button user-button">
            <div className="user-avatar">
              <span>S</span>
            </div>
          </button>
        </div>
      </div>

<<<<<<<< HEAD:Solaris/src/components/Header.jsx
      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={notificationsPanelOpen}
        onClose={closeNotificationsPanel}
      />

      {/* Backdrop */}
      <Backdrop
        isVisible={notificationsPanelOpen}
        onClick={closeNotificationsPanel}
      />
    </>
========
      <div className="header-icons">
        <button className="icon-button search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
<<<<<<< HEAD

        <button className="icon-button notification-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
=======
        
        <button className="icon-button notification-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="notification-dot orange-dot"></span>
        </button>
<<<<<<< HEAD

        <button className="icon-button mail-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
=======
        
        <button className="icon-button mail-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span className="notification-dot blue-dot"></span>
        </button>
<<<<<<< HEAD

=======
        
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        <button className="icon-button user-button">
          <div className="user-avatar">
            <span>T</span>
          </div>
        </button>
      </div>
    </div>
<<<<<<< HEAD
=======
>>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2:Solaris/src/components/layout/Header.jsx
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
  );
};

export default Header;
