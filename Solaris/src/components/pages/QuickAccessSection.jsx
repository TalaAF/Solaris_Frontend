import React from "react";
import { Link } from "react-router-dom";
import "./QuickAccessSection.css";

const QuickAccessSection = ({ quickAccessItems }) => {
  // Map the icons to the correct ones as shown in the image
  const getIcon = (title) => {
    switch (title) {
      case 'Courses':
        return <div className="quick-access-icon courses-icon"></div>;
      case 'Assessments':
        return <div className="quick-access-icon assessments-icon"></div>;
      case 'Calendar':
        return <div className="quick-access-icon calendar-icon"></div>;
      case 'Discussions':
        return <div className="quick-access-icon discussions-icon"></div>;
      case 'Clinical Skills':
        return <div className="quick-access-icon clinical-icon"></div>;
      case 'Study Groups':
        return <div className="quick-access-icon study-groups-icon"></div>;
      default:
        return <div className="quick-access-icon"></div>;
    }
  };

  // Create path from the title (lowercase with hyphens)
  const getPath = (title) => {
    return '/' + title.toLowerCase().replace(/\s+/g, '-');
  };

  // Add safeguards for undefined data
  const renderItems = () => {
    // If items is undefined or not an array, return empty placeholder
    if (!quickAccessItems || !Array.isArray(quickAccessItems)) {
      return (
        <div className="quick-access-placeholder">
          <p>No quick access items available</p>
        </div>
      );
    }

    // If we have items, map through them
    return quickAccessItems.map((item, index) => (
      <Link 
        key={index} 
        to={getPath(item.title)}
        className="quick-access-item"
      >
        {getIcon(item.title)}
        <div className="quick-access-content">
          <h4>{item.title}</h4>
          <p>{item.description}</p>
        </div>
      </Link>
    ));
  };

  return (
    <div className="quick-access-card">
      <h3 className="quick-access-title">Quick Access</h3>
      <div className="quick-access-grid">
        {renderItems()}
      </div>
    </div>
  );
};

export default QuickAccessSection;