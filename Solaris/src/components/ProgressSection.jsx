import React from 'react';
import './Dashboard.css';

const ProgressSection = ({ progressData }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Course Progress</h3>
      </div>
      <div className="overall-progress">
        <span>Overall Completion</span>
        <span className="overall-percentage">53%</span>
      </div>
      <div className="progress-container">
        {progressData.map((item, index) => (
          <div key={index} className="progress-item">
            <div className="progress-header">
              <span>{item.subject}</span>
              <span>{item.progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill progress-${item.progress > 60 ? 'green' : item.progress > 40 ? 'blue' : 'red'}`} 
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSection;