import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search..." />
      </div>
      
      <div className="user-actions">
        <div className="action-icon">🔔</div>
        <div className="action-icon">✉️</div>
        <div className="action-icon">👤</div>
      </div>
    </div>
  );
};

export default Header;