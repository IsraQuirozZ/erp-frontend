import "./sidebar.css";
import { FaHouse, FaUsers, FaBox, FaUserTie } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>IQ-ERP</h2>
      <div className="divider"></div>
      <nav className="sidebar-nav">
        <a href="/app/dashboard" className="sidebar-nav__item">
          <FaHouse size={30} />
          Dashboard
        </a>
        <a href="/app/customers" className="sidebar-nav__item">
          <FaUsers size={30} />
          Customers
        </a>
        <a href="/app/customers" className="sidebar-nav__item">
          <MdAttachMoney size={30} />
          Suppliers
        </a>
        <a href="/app/customers" className="sidebar-nav__item">
          <FaBox size={30} />
          Products
        </a>
        <a href="/app/customers" className="sidebar-nav__item">
          <FaUserTie size={30} />
          Employees
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
