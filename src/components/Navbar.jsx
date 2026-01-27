import "./navbar.css";
import { useState, useRef, useEffect } from "react";
import { FaBell, FaSearch, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { auth, logout } = useAuth();
  const isAdmin = auth?.user?.roles?.includes("ADMIN");

  const [open, setOpen] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="left">
        <div className="search-input">
          <FaSearch size={30} className="search-input__icon" />
          <input
            className="search-input__field"
            placeholder="Search for customers, orders, products..."
          />
        </div>
        <FaBell size={40} className="notifications" />
      </div>
      <div
        className="user"
        ref={userRef}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="user-icon">
          {auth?.user?.username
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
        </div>

        <h4>{auth?.user?.username.replace(/\b\w/g, (l) => l.toUpperCase())}</h4>
        <div className={`user-menu ${open ? "is-open" : ""}`}>
          <a href="/app/profile">
            <FaUser />
            Perfil
          </a>
          {isAdmin && (
            <a href="/app/users/create">
              <IoPersonAdd />
              Create User
            </a>
          )}
          <a href="/app/settings">
            <FaCog />
            Configuración
          </a>
          <button className="logout-btn" onClick={logout}>
            <FaSignOutAlt />
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
