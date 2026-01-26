import { FaBell } from "react-icons/fa";
function Navbar() {
  return (
    <header className="navbar">
      <input placeholder="Search..." />
      <FaBell />
      <div className="user">
        <div className="user-icon">IQ</div>
        <h4>Isra Quirozz</h4>
      </div>
    </header>
  );
}

export default Navbar;
