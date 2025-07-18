import React from "react";
import Dialog from "./Dialog";
import "./ConfirmDialog.css";

/**
 * A reusable confirmation dialog component.
 * 
 * @param {boolean} isOpen - Whether the dialog is open
 * @param {function} onClose - Function to call when the dialog should close
 * @param {function} onConfirm - Function to call when the action is confirmed
 * @param {string} title - Dialog title
 * @param {string} content - Dialog content/message
 * @param {string} confirmText - Text for confirmation button (optional)
 * @param {string} cancelText - Text for cancel button (optional)
 * @param {string} confirmButtonClass - Additional class for confirm button (optional)
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  content = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "danger-button"
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirm-dialog-content">
        <p>{content}</p>
        
        <div className="confirm-dialog-actions">
          <button 
            className="cancel-button" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-button ${confirmButtonClass}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;