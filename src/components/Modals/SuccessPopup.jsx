import "./successPopup.css";
import { FaCheckCircle } from "react-icons/fa";

function SuccessPopup({ open, title, message, onClose }) {
  if (!open) return null;

  return (
    <div className="success-popup-overlay">
      <div className="success-popup">
        <FaCheckCircle className="success-icon" />

        <h3>{title}</h3>
        <p>{message}</p>

        <button className="btn-primary" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default SuccessPopup;
