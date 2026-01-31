import "./loadingOverlay.css";

function LoadingOverlay({ visible, text = "Loading..." }) {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-overlay__content">
        <div className="loading-spinner" />
        <span>{text}</span>
      </div>
    </div>
  );
}

export default LoadingOverlay;
