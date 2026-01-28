import AddBtn from "../components/addBtn";
import DashboardCard from "../components/DashboardCard";
// CUSTOMERS TABLE
import TableToolbar from "../components/TableToolbar.jsx";
import DataTable from "../components/DataTable/DataTable";
import { customerColumns } from "../configs/customerTable.config.jsx";
import TableFooter from "../components/TableFooter.jsx";

import { useEffect, useState } from "react";
import { getCustomers } from "../services/customer.service.js";

import CardTop from "../components/CardTop";
import { FaUserGroup, FaArrowTrendUp } from "react-icons/fa6";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import "../styles/customers.css";

function Customers() {
  // const navigate = useNavigate();

  //BBDD
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();

        const mappedCustomers = data.map((c) => ({
          id: c.id_client,
          name: `${c.firstName} ${c.lastName}`,
          email: c.email,
          phone: c.phone,
          city: c.address?.province?.name ?? "-",
          status: c.active ? "Active" : "Inactive",
          createdAt: c.address?.municipality ?? "",
        }));

        setCustomers(mappedCustomers);
      } catch (error) {
        console.error("Error loading customers", error);
      }
    };

    fetchCustomers();
  }, []);

  const customerActions = (row) => {
    return (
      <div className="table-actions">
        <FaEye title="View" onClick={() => openPreview(row)} />
        <FaEdit title="Edit" onClick={() => openEdit(row)} />
        <FaTrash title="Delete" onClick={() => deleteCustomer(row.id)} />
      </div>
    );
  };

  const openPreview = (customer) => {
    console.log("Preview customer", customer);
  };

  const openEdit = (customer) => {
    console.log("Edit customer", customer);
  };

  const deleteCustomer = (id) => {
    console.log("Delete customer", id);
  };

  return (
    <div className="customers-container">
      <div className="container-top">
        <div className="container-title">
          <h1>Customers</h1>
          <h4>Manage your clients and their activity</h4>
        </div>
        <AddBtn
          icon={FaUserGroup}
          action="Add Customer"
          description="Register a new customer"
          onClick={() => navigate("/customers/new")}
          iconColor="#d752ce"
          iconBgColor="#ea7ce376"
        />
      </div>
      <div className="dashboard-cards">
        <DashboardCard
          title="Total customers"
          icon={FaUserGroup}
          iconBgColor="#00c24e"
          data="4734"
          stats={3.4}
        />

        <DashboardCard
          title="New this month"
          icon={FaUserGroup}
          iconBgColor="#6C89FF"
          data="182"
          stats={-1.4}
        />

        <CardTop
          title="Top Clients"
          icon={FaArrowTrendUp}
          iconBgColor="#f38744"
        />
      </div>

      <div className="table-container">
        {/* TOP TOOLBAR */}
        <TableToolbar placeholder="Search by name or email" />

        {/* TABLE */}
        <DataTable
          columns={customerColumns}
          data={customers}
          onRowClick={(row) => openPreview(row)}
          actions={customerActions}
        />

        {/* FOOTER */}
        <TableFooter total={customers.length} page={1} pages={1} />
      </div>
    </div>
  );
}

export default Customers;
