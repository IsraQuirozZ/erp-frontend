import { useAuth } from "../auth/AuthContext";
import "./sidebar.css";
import { FaHouse, FaUsers, FaBox, FaUserTie } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";

function Sidebar() {
  const { auth } = useAuth();
  const isAdmin = auth?.user?.roles?.includes("ADMIN");

  return (
    <aside className="sidebar">
      <h2>IQ-ERP</h2>
      <div className="divider"></div>
      <nav className="sidebar-nav">
        <a href="/app/dashboard" className="sidebar-nav__item">
          <FaHouse size={30} />
          Dashboard
        </a>

        {/* ADMIN */}
        {/* TODO: STAY HOVER WHEN IN PAGE */}
        {isAdmin && (
          <>
            <a href="/app/customers" className="sidebar-nav__item">
              <FaUsers size={25} />
              Customers
            </a>
            <a href="/app/suppliers" className="sidebar-nav__item">
              <IoPeople size={25} />
              Suppliers
            </a>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
