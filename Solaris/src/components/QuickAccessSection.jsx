import React from 'react';
import './Dashboard.css';

const QuickAccessSection = ({ quickAccessItems }) => {
  return (
    <div className="card">
      <h3 className="card-title">Quick Access</h3>
      <div className="quick-access-grid">
        {quickAccessItems.map((item, index) => (
          <div key={index} className="quick-access-item">
            <div className="quick-access-icon">{item.icon}</div>
            <div className="quick-access-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessSection;