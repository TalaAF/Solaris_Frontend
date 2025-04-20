import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="search-container">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      
      <div className="user-actions">
        <div className="action-icon">
          <span>🔍</span>
        </div>
        <div className="action-icon notification-icon">
          <span>🔔</span>
          <div className="notification-dot orange-dot"></div>
        </div>
        <div className="action-icon">
          <span>✉️</span>
          <div className="notification-dot blue-dot"></div>
        </div>
        <div className="action-icon user-avatar">
          <span>👤</span>
        </div>
      </div>
    </div>
  );
};

export default Header;