import { useAuth } from "../auth/AuthContext";
import "./sidebar.css";
import { FaHouse, FaUsers } from "react-icons/fa6";
import { FaShoppingCart, FaBox } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";

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
            <a href="/app/purchases" className="sidebar-nav__item">
              <FaShoppingCart size={25} />
              Purchases
            </a>
            <a href="/app/inventory" className="sidebar-nav__item">
              <FaBox size={25} />
              Inventory
            </a>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
