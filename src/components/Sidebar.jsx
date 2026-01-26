import "./sidebar.css";
function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>IQ-ERP</h2>
      <div className="divider"></div>
      <nav>
        <a href="/app/dashboard">Dashboard</a>
        <a href="/app/customers">Customers</a>
        <a href="/app/suppliers">Suppliers</a>
        <a href="/app/products">Products</a>
        <a href="/app/employees">Employees</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
