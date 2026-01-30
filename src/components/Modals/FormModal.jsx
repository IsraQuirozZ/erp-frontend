import "./formModal.css";
import { IoIosCloseCircle } from "react-icons/io";

function FormModal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="form-modal-overlay">
      <div className="form-modal">
        <div className="form-modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            <IoIosCloseCircle size={40} />
          </button>
        </div>

        <div className="form-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default FormModal;
