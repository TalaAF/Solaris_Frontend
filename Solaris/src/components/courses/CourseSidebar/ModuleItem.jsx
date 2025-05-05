
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
}) {
  if (!module) return null;

  // Helper function to get content icon based on type
  const getContentIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText className="item-icon" />;
      case "video":
        return <Video className="item-icon" />;
      case "quiz":
        return <ClipboardList className="item-icon" />;
      default:
        return <FileText className="item-icon" />;
    }
  };

  return (
    <div className={`module-container ${isActive ? "module-active" : ""}`}>
      <button
        className="module-button"
        onClick={() => setActiveModule(module.id)}
        aria-expanded={isActive}
      >
        <div className="module-button-content">
          <BookOpen className="module-icon" />
          <span className="module-title">{module.title}</span>
        </div>
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
                  onClick={() => setActiveItem(item.id)}
                >
                  {/* Left side with bullet and icon */}
                  <div className="item-main">
                    <span className="item-bullet">•</span>
                    {getContentIcon(item.type)}
                    <span className="item-title">{item.title}</span>
                  </div>

                  {/* Right side with duration */}
                  <div className="item-duration">{item.duration}</div>

                  {/* Completed icon */}
                  {item.status === "completed" && (
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
