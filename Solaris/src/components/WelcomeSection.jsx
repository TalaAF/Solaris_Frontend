import React from 'react';
import './WelcomeSection.css';

const WelcomeSection = () => {
  return (
    <div className="welcome-section">
      <h1>Good evening, Dr. Johnson</h1>
      <p className="date">Friday, April 18, 2025</p>
      
      <div className="day-glance">
        <div className="notification-icon">
          <i className="bell-icon"></i>
        </div>
        <div className="glance-content">
          <div className="glance-title">Your day at a glance</div>
          <div className="glance-details">You have 3 upcoming classes and 2 assignments due today.</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;