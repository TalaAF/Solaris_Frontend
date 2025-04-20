import React from 'react';
import { Chip as Badge } from '@mui/material';
import { BookOpen, FileText, Video, ClipboardList, Clock } from 'lucide-react';
import './ModuleItem.css';

/**
 * ModuleItem Component
 * 
 * Displays a single module with an expandable list of items.
 * Used within the ModuleList component.
 */
function ModuleItem({ 
  module, 
  isActive, 
  setActiveModule, 
  activeItem, 
  setActiveItem 
}) {
  if (!module) return null;

  // Helper function to get content icon based on type
  const getContentIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText className="item-icon" />;
      case 'video':
        return <Video className="item-icon" />;
      case 'quiz':
        return <ClipboardList className="item-icon" />;
      default:
        return <FileText className="item-icon" />;
    }
  };

  // Helper function to format status text
  const formatStatus = (status) => {
    return status.replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'not-started':
        return 'status-not-started';
      default:
        return 'status-default';
    }
  };

  return (
    <div className={`module-container ${isActive ? 'module-active' : ''}`}>
      <button 
        className="module-button"
        onClick={() => setActiveModule(module.id)}
        aria-expanded={isActive}
      >
        <div className="module-button-content">
          <BookOpen className="module-icon" />
          <span className="module-title">{module.title}</span>
        </div>
        <Badge className={`module-status ${getStatusClass(module.status)}`}>
          {formatStatus(module.status)}
        </Badge>
      </button>
      
      {isActive && module.items && (
        <div className="module-items">
          <ul className="items-list">
            {module.items.map(item => (
              <li key={item.id}>
                <button 
                  className={`item-button ${item.id === activeItem ? 'item-active' : ''}`}
                  onClick={() => setActiveItem(item.id)}
                >
                  <div className="item-main">
                    {getContentIcon(item.type)}
                    <span className="item-title">{item.title}</span>
                  </div>
                  <div className="item-meta">
                    <Badge 
                      label={item.status}
                      className={`item-status status-${item.status}`}
                      variant="outlined"
                      size="small"
                    />
                    <Badge 
                      label={item.type}
                      className={`item-type type-${item.type}`}
                      variant="outlined"
                      size="small"
                    />
                    <div className="item-duration">
                      <Clock className="duration-icon" />
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ModuleItem;
