import "./successPopup.css";
import { FaCheckCircle } from "react-icons/fa";

import "./confirmPopup.css";

function ConfirmPopup({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  if (!open) return null;

  return (
    <div className="confirm-popup-overlay">
      <div className="confirm-popup">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-popup-actions">
          <button className="btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPopup;
