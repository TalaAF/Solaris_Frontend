import React from "react";
import "./WelcomeSection.css";
import { useAuth } from "../../context/AuthContext";

const WelcomeSection = () => {
  const { currentUser } = useAuth();
  
  // Get student name from the authenticated user
  const studentName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Student";
  
  // Get current date
  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  
  // Determine time of day for greeting
  const hours = today.getHours();
  let greeting = "Good morning";
  
  if (hours >= 12 && hours < 17) {
    greeting = "Good afternoon";
  } else if (hours >= 17) {
    greeting = "Good evening";
  }
  
  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <h1>{greeting}, {studentName}</h1>
        <p className="date">{formattedDate}</p>
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