import React from 'react';
import './styles/Header.css';

const Header = ({ profile }) => {
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="dashboard-header">
      <div className="header-info">
        <p className="greeting">{greeting}, {profile?.name || 'User'}</p>
        <p className="date">{date}</p>
      </div>
    </header>
  );
};

export default Header;