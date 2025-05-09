import React from 'react';
import './styles/AdminActivityLog.css';

const AdminActivityLog = ({ activityLog }) => {
  return (
    <div className="admin-activity-log-card">
      <h2 className="section-heading">Activity Log</h2>
      <p className="section-subtitle">Your recent activities</p>
      <table className="activity-table">
        <thead>
          <tr>
            <th>Operation</th>
            <th>Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {activityLog.map((log, index) => (
            <tr key={index}>
              <td>{log.operation}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminActivityLog;