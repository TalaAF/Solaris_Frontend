import React from 'react';
import './Dashboard.css';

const ScheduleSection = ({ scheduleItems }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Today's Schedule</h3>
        <div className="card-date">Friday, Apr 18</div>
      </div>
      <div className="schedule-list">
        {scheduleItems.map((item, index) => (
          <div key={index} className={`schedule-item schedule-item-${item.color}`}>
            <div className="schedule-content">
              <h4>{item.title}</h4>
              <p>{item.location}</p>
            </div>
            <div className="schedule-time">
              <span className="time-icon">🕒</span>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleSection;