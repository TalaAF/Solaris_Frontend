<<<<<<< HEAD
import React from "react";
import {
  BookOpen,
  FileText,
  Video,
  ClipboardList,
  CheckCircle,
} from "lucide-react";
import "./ModuleItem.css";

/**
 * ModuleItem Component - Simplified Version
 *
 * Displays a single module with an expandable list of items.
 * Used within the ModuleList component.
 */
function ModuleItem({
  module,
  isActive,
  setActiveModule,
  activeItem,
  setActiveItem,
=======
import React from 'react';
import { BookOpen, FileText, Video, ClipboardList, CheckCircle } from 'lucide-react';
import './ModuleItem.css';

/**
 * ModuleItem Component - Simplified Version
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
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
}) {
  if (!module) return null;

  // Helper function to get content icon based on type
  const getContentIcon = (type) => {
    switch (type) {
<<<<<<< HEAD
      case "document":
        return <FileText className="item-icon" />;
      case "video":
        return <Video className="item-icon" />;
      case "quiz":
=======
      case 'document':
        return <FileText className="item-icon" />;
      case 'video':
        return <Video className="item-icon" />;
      case 'quiz':
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        return <ClipboardList className="item-icon" />;
      default:
        return <FileText className="item-icon" />;
    }
  };

  return (
<<<<<<< HEAD
    <div className={`module-container ${isActive ? "module-active" : ""}`}>
      <button
=======
    <div className={`module-container ${isActive ? 'module-active' : ''}`}>
      <button 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        className="module-button"
        onClick={() => setActiveModule(module.id)}
        aria-expanded={isActive}
      >
        <div className="module-button-content">
          <BookOpen className="module-icon" />
          <span className="module-title">{module.title}</span>
        </div>
<<<<<<< HEAD
        {module.status === "completed" && (
          <CheckCircle className="status-icon" />
        )}
      </button>

      {isActive && module.items && (
        <div className="module-items">
          <ul className="items-list">
            {module.items.map((item) => (
              <li
                key={item.id}
                className={`item-container ${item.id === activeItem ? "active" : ""}`}
              >
                <button
                  className={`item-button ${item.id === activeItem ? "item-active" : ""}`}
=======
        {module.status === 'completed' && (
          <CheckCircle className="status-icon" />
        )}
      </button>
      
      {isActive && module.items && (
        <div className="module-items">
          <ul className="items-list">
            {module.items.map(item => (
              <li 
                key={item.id} 
                className={`item-container ${item.id === activeItem ? 'active' : ''}`}
              >
                <button 
                  className={`item-button ${item.id === activeItem ? 'item-active' : ''}`}
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                  onClick={() => setActiveItem(item.id)}
                >
                  {/* Left side with bullet and icon */}
                  <div className="item-main">
                    <span className="item-bullet">•</span>
                    {getContentIcon(item.type)}
                    <span className="item-title">{item.title}</span>
                  </div>

                  {/* Right side with duration */}
<<<<<<< HEAD
                  <div className="item-duration">{item.duration}</div>

                  {/* Completed icon */}
                  {item.status === "completed" && (
=======
                  <div className="item-duration">
                    {item.duration}
                  </div>

                  {/* Completed icon */}
                  {item.status === 'completed' && (
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
                    <CheckCircle className="completion-check" />
                  )}
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
