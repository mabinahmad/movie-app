import React from "react";
import "./ConfirmationModal.css";
//===============================================

// ConfirmationModal component to display a confirmation dialog
//-----------------------------------------------------------------
export const ConfirmationModal = ({ isOpen, onCancel, onConfirm, movieId }) => {
  // If the modal is not open, don't render anything
  if (!isOpen) {
    return null;
  }
  return (
    <div className="confirmation-modal">
      <p>Are you sure you want to delete this movie from Watch Later?</p>
      <button className="cancel" onClick={onCancel}>
        Cancel
      </button>
      <button className="confirm" onClick={() => onConfirm(movieId)}>
        Confirm
      </button>
    </div>
  );
};
