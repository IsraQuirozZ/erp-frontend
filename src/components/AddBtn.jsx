import "./addBtn.css";

function AddBtn({
  icon: Icon,
  action,
  description,
  onClick,
  disabled = false,
  iconColor = "#4f27ee",
  iconBgColor = "#4f27ee78",
}) {
  return (
    <button className="addBtn" onClick={onClick} disabled={disabled}>
      <Icon
        className="addBtn-icon"
        size={50}
        style={{
          backgroundColor: iconBgColor,
          color: iconColor,
        }}
      />
      <div className="addBtn-content">
        <p className="tx-xlg">{action}</p>
        <p className="tx-lg">{description}</p>
      </div>
    </button>
  );
}

export default AddBtn;
