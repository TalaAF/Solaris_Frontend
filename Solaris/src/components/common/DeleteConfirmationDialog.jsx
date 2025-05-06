import React from "react";
import Dialog from "./Dialog";
import "./DeleteConfirmationDialog.css";

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, title, description }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="delete-dialog">
        <p className="delete-description">{description}</p>
        
        <div className="delete-actions">
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