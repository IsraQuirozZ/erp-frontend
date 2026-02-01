import AddBtn from "../components/addBtn";
import DashboardCard from "../components/DashboardCard";

// LOADING
import LoadingOverlay from "../components/ui/LoadingOverlay";

// FORM MODAL
import FormModal from "../components/Modals/FormModal.jsx";
import CustomerForm from "../components/Forms/CustomersForm.jsx";

// CUSTOMERS TABLE
import TableToolbar from "../components/TableToolbar.jsx";
import DataTable from "../components/DataTable/DataTable";
import { customerColumns } from "../configs/customerTable.config.jsx";
import TableFooter from "../components/TableFooter.jsx";

import { useEffect, useState } from "react";
import {
  getCustomers,
  getCustomerById,
  activateCustomer,
} from "../services/customer.service.js";

import CardTop from "../components/CardTop";
import { FaUserGroup, FaArrowTrendUp, FaPowerOff } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

import "../styles/customers.css";

function Customers() {
  //BBDD
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  // FILTERS
  // ACTIVE/INACTIVE
  const [statusFilter, setStatusFilter] = useState("all");

  // SORTING
  // NAME && LASTNAME
  const [sort, setSort] = useState({
    field: "name",
    order: "asc",
  });

  // OnClick() -> AddBtn
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" | "edit"
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // FETCH CUSTOMERS
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await getCustomers({
        page,
        limit,
        status: statusFilter,
        sort: sort.field,
        order: sort.order,
      });

      const mappedCustomers = res.data.map((c) => ({
        id: c.id_client,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        phone: c.phone,
        city: c.address?.province?.name ?? "-",
        status: c.active ? "Active" : "Inactive",
        active: c.active,
      }));

      setCustomers(mappedCustomers);
      setPages(res.pages);
      setTotal(res.total);
    } catch (error) {
      console.error("Error loading customers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, statusFilter, sort]);

  const customerActions = (row) => {
    return (
      <div className="table-actions">
        <FaEdit
          size={20}
          className="table-actions__icon icon-edit"
          title="Edit"
          onClick={() => openEdit(row)}
        />
        <FaPowerOff
          size={20}
          className="table-actions__icon icon-delete"
          title="Activate/Deactivate"
          onClick={() => toggleActive(row)}
        />
      </div>
    );
  };

  // PREVIEW
  const openPreview = (customer) => {
    console.log("Preview customer", customer);
  };

  // EDIT
  const openEdit = async (row) => {
    try {
      setFormMode("edit");
      const fullCustomer = await getCustomerById(row.id);
      setSelectedCustomer(fullCustomer);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  // ACTIVATE/DEACTIVATE
  const toggleActive = async (row) => {
    try {
      await activateCustomer(row.id);
      await fetchCustomers();
    } catch (error) {
      console.error("Error activating customer:", error);
    }
  };

  // TODO: Change name to reuse css
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
          onClick={() => {
            setFormMode("create");
            setSelectedCustomer(null);
            setIsModalOpen(true);
          }}
          iconColor="#d752ce"
          iconBgColor="#ea7ce376"
        />
      </div>
      <div className="dashboard-cards">
        <DashboardCard
          title="Total customers"
          icon={FaUserGroup}
          iconBgColor="#00c24e"
          data={total}
          stats={3.4}
        />

        <DashboardCard
          title="New this month"
          icon={FaUserGroup}
          iconBgColor="#6C89FF"
          data="182"
          stats={-3}
        />

        <CardTop
          title="Top Clients"
          icon={FaArrowTrendUp}
          iconBgColor="#f38744"
        />
      </div>

      <div className="table-container table-dark">
        <LoadingOverlay visible={loading} text="Loading customers..." />
        {/* TOP TOOLBAR */}
        <TableToolbar
          placeholder="Search by name or email"
          filters={[
            {
              key: "status",
              type: "select",
              value: statusFilter,
              onChange: (value) => {
                setPage(1);
                setStatusFilter(value);
              },
              options: [
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
          ]}
          onSort={() => {
            setPage(1);
            setSort((prev) => ({
              field: "name",
              order: prev.order === "asc" ? "desc" : "asc",
            }));
          }}
          sortOrder={sort.order}
        />

        {/* TABLE */}
        <DataTable
          columns={customerColumns}
          data={customers}
          onRowClick={(row) => openPreview(row)}
          actions={customerActions}
        />

        {/* FOOTER */}
        <TableFooter
          page={page}
          pages={pages}
          total={customers.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      <FormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formMode === "create" ? "Create Customer" : "Edit Customer"}
      >
        <CustomerForm
          mode={formMode}
          initialData={selectedCustomer}
          onClose={() => setIsModalOpen(false)}
          onSuccess={async () => {
            setIsModalOpen(false);
            await fetchCustomers();
          }}
        />
      </FormModal>
    </div>
  );
}

export default Customers;
