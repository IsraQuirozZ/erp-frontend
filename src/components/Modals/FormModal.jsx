import "./formModal.css";

function FormModal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="form-modal-overlay">
      <div className="form-modal">
        <div className="form-modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>

        <div className="form-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default FormModal;
