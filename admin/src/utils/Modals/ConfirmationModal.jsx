import React from "react";
import "./ConfirmationModal.css";

// Component for displaying a confirmation modal
//--------------------------------------------------
export const ConfirmationModal = ({ isOpen, onCancel, onConfirm, id }) => {
  // If the modal is not open, return null to render nothing
  if (!isOpen) {
    return null;
  }
  return (
    <div className="confirmation-modal">
      <p>Are you sure you want to delete this movie from Watch Later?</p>
      <button className="cancel" onClick={onCancel}>
        Cancel
      </button>
      <button className="confirm" onClick={() => onConfirm(id)}>
        Confirm
      </button>
    </div>
  );
};
