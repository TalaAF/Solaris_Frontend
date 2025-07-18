import React from "react";
import "./StatCard.css";

const StatCard = ({ title, value, icon, trend, className }) => {
  return (
    <div className={`stat-card ${className || ""}`}>
      <div className="stat-card-content">
        <div className="stat-info">
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">{value}</h3>
          {trend && (
            <div className="stat-trend">
              <span className={`trend-value ${trend.positive ? 'positive' : 'negative'}`}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
              <span className="trend-period">vs last month</span>
            </div>
          )}
        </div>
        <div className="stat-icon">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;