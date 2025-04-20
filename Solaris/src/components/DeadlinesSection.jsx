import React from 'react';
import './Dashboard.css';

const DeadlinesSection = ({ deadlines }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Upcoming Deadlines</h3>
      </div>
      <div className="deadlines-list">
        {deadlines.map((item, index) => (
          <div key={index} className="deadline-item">
            <div className={`deadline-dot deadline-dot-${item.color}`}></div>
            <div className="deadline-content">
              <h4>{item.title}</h4>
              <p>{item.course}</p>
            </div>
            <div className="deadline-date">
              <span className="date-icon">📅</span>
              <span>{item.due}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlinesSection;