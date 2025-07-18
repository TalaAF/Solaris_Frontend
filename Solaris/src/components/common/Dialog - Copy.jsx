import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import "./Dialog.css";

const Dialog = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Add class to body to prevent background scrolling
      document.body.classList.add("dialog-open");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Remove class when dialog closes
      document.body.classList.remove("dialog-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Render the dialog using a portal to ensure it's at the root level
  return ReactDOM.createPortal(
    <div className="dialog-overlay" onClick={handleBackdropClick}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 className="dialog-title">{title}</h2>
          <button 
            className="dialog-close" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="dialog-content">
          {children}
        </div>
      </div>
    </div>,
    document.body // Mount the portal directly to the body element
  );
};

export default Dialog;