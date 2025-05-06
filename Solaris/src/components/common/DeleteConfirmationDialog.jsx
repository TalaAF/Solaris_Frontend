import React from "react";
import Dialog from "./Dialog";
import "./DeleteConfirmationDialog.css";

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, title, description }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Confirm Deletion"}
      maxWidth="400px"
    >
      <div className="delete-confirmation-container">
        <p className="delete-confirmation-message">
          {description || "Are you sure you want to delete this item? This action cannot be undone."}
        </p>
        
        <div className="delete-confirmation-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;