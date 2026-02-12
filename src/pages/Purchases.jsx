import "../styles/pages.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Icons
import { FaShoppingCart } from "react-icons/fa";

// UI & hooks
import { useToast } from "../components/ui/Toast";

// Components
import AddBtn from "../components/addBtn";
import DashboardCard from "../components/DashboardCard";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ConfirmPopup from "../components/Modals/ConfirmPopup.jsx";
import FormModal from "../components/Modals/FormModal.jsx";
import SupplierSelectForm from "../components/Forms/SupplierSelectForm.jsx";
import OrderPreview from "../components/previews/OrderPreview.jsx";

// Table
import TableToolbar from "../components/TableToolbar.jsx";
import DataTable from "../components/DataTable/DataTable";
import TableFooter from "../components/TableFooter.jsx";
import { purchaseColumns } from "../configs/purchaseTable.config.jsx";

// Services
import {
  getSupplierOrders,
  updateSupplierOrderStatus,
} from "../services/purchases.service.js";

/**
 * Allowed status transitions per order status
 */
const statusTransitions = {
  PENDING: [
    { label: "Confirm", next: "CONFIRMED", color: "#6c89ff" },
    { label: "Cancel", next: "CANCELLED", color: "#dc3545" },
  ],
  CONFIRMED: [
    { label: "Mark as Received", next: "RECEIVED", color: "#00c24e" },
  ],
  RECEIVED: [],
  CANCELLED: [],
};

function Purchases() {
  const location = useLocation();

  /* =======================
     Table & data state
  ======================== */
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 4;

  // Filters & sorting
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ field: "name", order: "asc" });

  /* =======================
     Modals & preview state
  ======================== */
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [previewOrderId, setPreviewOrderId] = useState(null);

  // Status confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [pendingTransition, setPendingTransition] = useState(null);

  const { showToast } = useToast();
  /* =======================
     Data fetching
  ======================== */
  const fetchPurchases = async () => {
    try {
      setLoading(true);

      const res = await getSupplierOrders({
        page,
        limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort: sort.field,
        order: sort.order,
      });

      const mapped = res.data.map((p) => ({
        id: p.id_supplier_order,
        order: p.id_supplier_order,
        supplier: p.supplier?.name ?? "-",
        supplierId: p.id_supplier,
        products: p.totalProducts,
        total: p.total,
        status: p.status,
      }));

      setPurchases(mapped);
      setPages(res.pages);
    } catch (error) {
      console.error("Error loading purchases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [page, statusFilter, sort]);

  /* =======================
     Actions
  ======================== */
  const openPreview = (row) => {
    if (!row?.id || !row?.supplierId) return;

    setPreviewOrderId(row.id);
    setIsPreviewOpen(true);
  };

  const handleStatusChange = async () => {
    if (!pendingOrder || !pendingTransition) return;

    try {
      await updateSupplierOrderStatus(pendingOrder.id, pendingTransition);
      await fetchPurchases();
      showToast("Status updated successfully", "success");
    } catch (error) {
      showToast(error, "error");
    } finally {
      setShowConfirm(false);
      setPendingOrder(null);
      setPendingTransition(null);
    }
  };

  const purchasesActions = (row) => {
    const transitions = statusTransitions[row.status] || [];

    return (
      <div className="table-actions">
        {transitions.map((t) => (
          <button
            key={t.next}
            style={{
              background: t.color,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "4px 10px",
              marginRight: 6,
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setPendingOrder(row);
              setPendingTransition(t.next);
              setShowConfirm(true);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container">
      {/* Page header */}
      <div className="container-top">
        <div className="container-title">
          <h1>Purchase Orders</h1>
          <h4>Manage your purchase orders and supplier interactions.</h4>
        </div>

        <AddBtn
          icon={FaShoppingCart}
          action="New Order"
          description="Generate a new order"
          onClick={() => setIsFormOpen(true)}
          iconColor="#6c89ff"
          iconBgColor="#6c89ff81"
        />
      </div>

      {/* Dashboard cards (static for now) */}
      <div className="dashboard-cards">
        <DashboardCard
          title="Total purchases"
          icon={FaShoppingCart}
          iconBgColor="#00c24e"
          data="12.450 €"
          stats={3.4}
        />
        <DashboardCard
          title="This month"
          icon={FaShoppingCart}
          iconBgColor="#00c24e"
          data="12.450 €"
          stats={3.4}
        />
        <DashboardCard
          title="Active Suppliers"
          icon={FaShoppingCart}
          iconBgColor="#00c24e"
          data="12.450 €"
          stats={3.4}
        />
        <DashboardCard
          title="Pending Orders"
          icon={FaShoppingCart}
          iconBgColor="#00c24e"
          data="12.450 €"
          stats={3.4}
        />
      </div>

      {/* Status confirmation */}
      <ConfirmPopup
        open={showConfirm}
        title="Confirm Status Change"
        message={`Change order #${pendingOrder?.order} to ${pendingTransition}?`}
        onConfirm={handleStatusChange}
        onCancel={() => setShowConfirm(false)}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      {/* Table */}
      <div className="table-container">
        <LoadingOverlay visible={loading} text="Loading purchases..." />

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
                { label: "Pending", value: "pending" },
                { label: "Confirmed", value: "confirmed" },
                { label: "Received", value: "received" },
                { label: "Cancelled", value: "cancelled" },
              ],
            },
          ]}
          onSort={() =>
            setSort((prev) => ({
              field: "name",
              order: prev.order === "asc" ? "desc" : "asc",
            }))
          }
          sortOrder={sort.order}
        />

        <DataTable
          columns={purchaseColumns}
          data={purchases}
          onRowClick={openPreview}
          actions={purchasesActions}
        />

        <TableFooter
          page={page}
          pages={pages}
          total={purchases.length}
          onPageChange={setPage}
        />
      </div>

      {/* Create order modal */}
      <FormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Create Order"
      >
        <SupplierSelectForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={async (order) => {
            await fetchPurchases();
            if (order?.id_supplier_order) {
              setPreviewOrderId(order.id_supplier_order);
              setIsPreviewOpen(true);
              showToast("Order created successfully", "success");
            }
            setIsFormOpen(false);
          }}
        />
      </FormModal>

      {/* Order preview */}
      {isPreviewOpen && (
        <OrderPreview
          orderId={previewOrderId}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewOrderId(null);
            fetchPurchases();
          }}
        />
      )}
    </div>
  );
}

export default Purchases;
