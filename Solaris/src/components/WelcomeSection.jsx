import React from 'react';
import './Dashboard.css';

const WelcomeSection = () => {
  return (
    <div className="welcome-section">
      <h2>Good evening, Dr. Johnson</h2>
      <p className="date">Friday, April 18, 2025</p>
      
      <div className="day-glance">
        <div className="notification-icon">🔔</div>
        <div className="glance-content">
          <div className="glance-title">Your day at a glance</div>
          <div className="glance-details">You have 3 upcoming classes and 2 assignments due today.</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;