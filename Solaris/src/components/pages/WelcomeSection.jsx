import React from "react";
import "./WelcomeSection.css";

const WelcomeSection = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <h1>Good evening, Saja Shawawra</h1>
        <p className="date">Friday, April 18, 2025</p>
      </div>
      
      <div className="glance-card">
        <div className="bell-icon-container">
          <svg 
            className="bell-icon" 
            width="24" 
            height="24" 
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
        </div>
        <div className="glance-content">
          <p className="glance-title">Your day at a glance</p>
          <p className="glance-details">You have 3 upcoming classes and 2 assignments due today.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;