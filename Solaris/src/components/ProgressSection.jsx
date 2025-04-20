import React from 'react';
import './ProgressSection.css';

const ProgressSection = ({ progressData }) => {
  return (
    <div className="progress-card">
      <h3 className="progress-title">Course Progress</h3>
      
      <div className="overall-progress-container">
        <div className="overall-progress-label">Overall Completion</div>
        <div className="overall-progress-value">53%</div>
      </div>
      
      <div className="overall-progress-bar">
        <div className="overall-progress-fill" style={{ width: '53%' }}></div>
      </div>
      
      <div className="progress-items-container">
        {progressData.map((item, index) => (
          <div key={index} className="progress-item">
            <div className="progress-item-header">
              <div className="progress-item-label">{item.subject}</div>
              <div className="progress-item-value">{item.progress}%</div>
            </div>
            <div className="progress-item-bar-container">
              <div 
                className={`progress-item-bar progress-${getColorClass(item.subject)}`} 
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to determine color class based on subject
const getColorClass = (subject) => {
  switch (subject) {
    case "Anatomy and Physiology":
      return "orange";
    case "Clinical Pathology":
      return "blue";
    case "Pharmacology":
      return "purple";
    case "Medical Ethics":
      return "red";
    default:
      return "blue";
  }
};

export default ProgressSection;