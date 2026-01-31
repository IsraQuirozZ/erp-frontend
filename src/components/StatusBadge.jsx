import "./statusBadge.css";

function StatusBadge({ status }) {
  if (!status) return null;
  const normalized = String(status).toLowerCase();
  return <span className={`status-badge ${normalized}`}>{normalized}</span>;
}

export default StatusBadge;
