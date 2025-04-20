import React from 'react';

const Header = () => {
  return (
    <div className="header">
      <div className="search-bar">
        <span>🔍</span>
        <input type="text" placeholder="Search transactions, customers, subscriptions" />
      </div>
      
      <div className="user-actions">
        <div className="icon-button">🔔</div>
        <div className="icon-button">✉️</div>
        <div className="icon-button">👤</div>
      </div>
    </div>
  );
};

export default Header;