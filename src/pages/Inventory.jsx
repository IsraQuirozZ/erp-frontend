import "../styles/pages.css";
import { useEffect, useState } from "react";

// Icons
import { FaWarehouse, FaEdit } from "react-icons/fa";
import { FaArrowTrendUp, FaPowerOff } from "react-icons/fa6";

// UI & hooks
import { useToast } from "../components/ui/Toast";

// Components
import AddBtn from "../components/addBtn";
import DashboardCard from "../components/DashboardCard";
import CardTop from "../components/CardTop";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ConfirmPopup from "../components/Modals/ConfirmPopup.jsx";
import FormModal from "../components/Modals/FormModal.jsx";
import WarehouseForm from "../components/Forms/WarehouseForm.jsx";
import InventoryPreview from "../components/previews/InventoryPreview.jsx";

// Table
import TableToolbar from "../components/TableToolbar.jsx";
import DataTable from "../components/DataTable/DataTable";
import TableFooter from "../components/TableFooter.jsx";
import { warehouseColumns } from "../configs/warehouseTable.config.jsx";

// Services
import {
  getWarehouses,
  getWarehouseById,
  activateWarehouse,
} from "../services/warehouse.service.js";

function Inventory() {
  const { showToast } = useToast();
  // STATES
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [warehouseId, setWarehouseId] = useState(null);

  // CONFIRM POPUP
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingWarehouse, setPendingWarehouse] = useState(null);

  // TABLE DATA
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState([]);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 4;

  // FILTERS
  // ACTIVE/INACTIVE
  const [statusFilter, setStatusFilter] = useState("all");

  // SORTING
  // NAME
  const [sort, setSort] = useState({
    field: "name",
    order: "asc",
  });
  // TODO: Sort by capacity and type

  // DATA FETCHING
  const fetchWarehouses = async () => {
    try {
      setLoading(true);

      const res = await getWarehouses({
        page,
        limit,
        status: statusFilter,
        sort: sort.field,
        order: sort.order,
      });

      const mapped = res.data.map((w) => ({
        id: w.id_warehouse,
        name: w.name,
        type: w.warehouse_type,
        capacity: w.capacity,
        province: w.address.province.name,
        status: w.active ? "Active" : "Inactive",
        active: w.active,
      }));

      setWarehouses(mapped);
      setPages(res.pages);
    } catch (error) {
      showToast("Error fetching warehouses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [page, statusFilter, sort]);

  // ACTIONS
  // CREATE (ADDBTN)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  // EDIT
  const openEdit = async (row) => {
    try {
      setFormMode("edit");
      const warehouse = await getWarehouseById(row.id);
      setSelectedWarehouse(warehouse);
      setIsModalOpen(true);
    } catch (error) {
      showToast("Error loading warehouse details", "error");
    }
  };

  // ACTIVATE/DEACTIVATE
  const toggleActive = async (row) => {
    try {
      const res = await activateWarehouse(row.id);
      await fetchWarehouses();
      showToast(res, "success");
    } catch (error) {
      showToast(error, "error");
      console.error("Error activating warehouse:", error);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (pendingWarehouse) {
      await toggleActive(pendingWarehouse);
      setPendingWarehouse(null);
      setShowConfirm(false);
    }
  };

  const warehousesActions = (row) => {
    return (
      <div className="table-actions">
        <FaEdit
          size={20}
          className="table-actions__icon icon-edit"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            openEdit(row);
          }}
        />
        <FaPowerOff
          size={20}
          className="table-actions__icon icon-delete"
          title="Activate/Deactivate"
          onClick={(e) => {
            e.stopPropagation();
            if (row.active) {
              setPendingWarehouse(row);
              setShowConfirm(true);
            } else {
              toggleActive(row);
            }
          }}
        />
      </div>
    );
  };

  // INVENTORY PREVIEW
  const openPreview = (row) => {
    if (!row?.id) return;
    setWarehouseId(row.id);
    setIsPreviewOpen(true);
  };

  return (
    <div className="customers-container">
      <ConfirmPopup
        open={showConfirm}
        title="Confirm Deactivation"
        message="All products will be deactivated. Are you sure you want to deactivate this warehouse?"
        onConfirm={handleConfirmDeactivate}
        onCancel={() => {
          setShowConfirm(false);
          setPendingWarehouse(null);
        }}
        confirmText="Deactivate"
        cancelText="Cancel"
      />
      <div className="container-top">
        <div className="container-title">
          <h1>Inventory</h1>
          <h4>Manage warehouses and their inventory</h4>
        </div>
        <AddBtn
          icon={FaWarehouse}
          action="Add Warehouse"
          description="Register a new warehouse"
          onClick={() => {
            setFormMode("create");
            setSelectedWarehouse(null);
            setIsModalOpen(true);
          }}
          iconColor="#FF7621"
          iconBgColor="#f387447d"
        />
      </div>
      <div className="dashboard-cards">
        <DashboardCard
          title="Total suppliers"
          icon={FaWarehouse}
          iconBgColor="#00c24e"
          data="12"
          stats={3.4}
        />
        <DashboardCard
          title="Total products"
          icon={FaWarehouse}
          iconBgColor="#6C89FF"
          data="182"
          stats={-3}
        />
      </div>
      <div className="table-container">
        <LoadingOverlay visible={loading} text="Loading warehouses..." />
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
          columns={warehouseColumns}
          data={warehouses}
          onRowClick={(row) => openPreview(row.original ?? row)}
          actions={warehousesActions}
        />
        {/* TABLE FOOTER */}
        <TableFooter
          page={page}
          pages={pages}
          total={warehouses.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      <FormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formMode === "create" ? "Create Warehouse" : "Edit Warehouse"}
      >
        <WarehouseForm
          mode={formMode}
          initialData={selectedWarehouse}
          onClose={() => setIsModalOpen(false)}
          onSuccess={async () => {
            setIsModalOpen(false);
            await fetchWarehouses();
          }}
        />
      </FormModal>

      {isPreviewOpen && (
        <InventoryPreview
          id_warehouse={warehouseId}
          onClose={() => {
            setIsPreviewOpen(false);
            setWarehouseId(null);
            fetchWarehouses();
          }}
        />
      )}
    </div>
  );
}

export default Inventory;
