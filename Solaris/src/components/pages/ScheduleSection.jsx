import React from "react";
import "./ScheduleSection.css";

const ScheduleSection = ({ scheduleItems }) => {
  return (
    <div className="schedule-card">
      <div className="schedule-card-header">
        <h3 className="schedule-title">Today's Schedule</h3>
        <div className="schedule-date">Friday, Apr 18</div>
      </div>
      <div className="schedule-list">
        {scheduleItems.map((item, index) => (
          <div
            key={index}
            className={`schedule-item schedule-item-${item.color}`}
          >
            <div className="schedule-content">
              <h4 className="schedule-item-title">{item.title}</h4>
              <p className="schedule-item-location">{item.location}</p>
            </div>
            <div className="schedule-time">
              <span className="time-icon">⏱</span>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleSection;
