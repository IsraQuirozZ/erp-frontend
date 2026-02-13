function Preview() {
  return (
    <div className="preview-overlay">
      <aside className={`preview${closing ? " slide-out" : ""}`}>
        <h2>Preview Title</h2>{" "}
        <button className="close-btn" onClick={handleClose}>
          <IoIosCloseCircle size={50} />
        </button>
      </aside>
    </div>
  );
}

export default Preview;
