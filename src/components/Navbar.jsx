import "./navbar.css";
import { FaBell } from "react-icons/fa";
function Navbar() {
  return (
    <header className="navbar">
      <div className="left">
        <input placeholder="Search..." />
        <FaBell size={40} />
      </div>
      <div className="user">
        <div className="user-icon">IQ</div>
        <h4>Isra Quirozz</h4>
      </div>
    </header>
  );
}

export default Navbar;
