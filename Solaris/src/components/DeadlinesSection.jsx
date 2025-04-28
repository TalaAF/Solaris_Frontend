import React from 'react';
import './DeadlinesSection.css';

const DeadlinesSection = ({ deadlines }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Upcoming Deadlines</h3>
      </div>
      <div className="deadlines-list">
        {deadlines.map((item, index) => (
          <div key={index} className="deadline-item">
            <div className="deadline-dot-container">
              <div className={`deadline-dot ${item.color === 'blue' ? 'blue-dot' : 'orange-dot'}`}></div>
            </div>
            <div className="deadline-content">
              <h4 className="deadline-title">{item.title}</h4>
              <p className="deadline-course">{item.course}</p>
            </div>
            <div className="deadline-date">
              <span className="date-icon">⏱</span>
              <span className="date-text">{item.due}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlinesSection;