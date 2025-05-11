import React from 'react';
import { Search, FileX, AlertTriangle, Plus } from 'lucide-react';

const EmptyState = ({ title, description, action, icon = 'Search' }) => {
  // Icon mapping
  const iconMap = {
    Search: <Search size={48} />,
    File: <FileX size={48} />,
    Warning: <AlertTriangle size={48} />,
    Plus: <Plus size={48} />
  };

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {iconMap[icon] || iconMap.Search}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button 
          className="solaris-button primary-button" 
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;