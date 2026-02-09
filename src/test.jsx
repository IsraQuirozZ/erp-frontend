import "../styles/pages.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//ICONS
import { FaShoppingCart } from "react-icons/fa";

// COMPONENTS
import { useToast } from "../components/ui/Toast";
import ConfirmPopup from "../components/Modals/ConfirmPopup.jsx";
import SuccessPopup from "../components/Modals/SuccessPopup.jsx";
import AddBtn from "../components/addBtn";
import DashboardCard from "../components/DashboardCard";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import OrderPreview from "../components/previews/OrderPreview.jsx";
import FormModal from "../components/Modals/FormModal.jsx";
import SupplierSelectForm from "../components/Forms/SupplierSelectForm.jsx";
// import PurchaseForm from "../components/Forms/PurchaseForm.jsx";
import CardTop from "../components/CardTop";

// PURCHASES TABLE
import {
  getSupplierOrders,
  updateSupplierOrderStatus,
} from "../services/purchases.service.js";
import { purchaseColumns } from "../configs/purchaseTable.config.jsx";
import TableToolbar from "../components/TableToolbar.jsx";
import DataTable from "../components/DataTable/DataTable";
import TableFooter from "../components/TableFooter.jsx";

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
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // If coming from SupplierPreview, supplierId will be in state
  const supplierId = location.state?.supplierId || null;
  const openPreviewFromSupplier = location.state?.openPreview || false;

  const [loading, setLoading] = useState(true);

  // FILTERS
  // ACTIVE/INACTIVE
  const [statusFilter, setStatusFilter] = useState("all");

  // SORTING
  // NAME && LASTNAME
  const [sort, setSort] = useState({
    field: "name",
    order: "asc",
  });

  //DB
  const [purchases, setPurchases] = useState([]);
  // PAGINATION
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;

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

      const mappedPurchases = res.data.map((p) => ({
        id: p.id_supplier_order,
        order: p.id_supplier_order,
        supplier: p.supplier?.name ?? "-",
        supplierId: p.id_supplier,
        products: p.totalProducts,
        total: p.total,
        status: p.status,
      }));

      setPurchases(mappedPurchases);
      setPages(res.pages);
      setTotal(res.total);
    } catch (error) {
      console.log("Error loading purchases", error);
    } finally {
      setLoading(false);
    }
  };

  // OnClick
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // PREVIEW
  const [isPreviewOpen, setIsPreviewOpen] = useState(openPreviewFromSupplier);
  const [previewSupplierId, setPreviewSupplierId] = useState(
    openPreviewFromSupplier ? supplierId : null,
  );
  const [previewOrderId, setPreviewOrderId] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [pendingTransition, setPendingTransition] = useState(null);

  const handleStatusChange = async (row, nextStatus) => {
    try {
      await updateSupplierOrderStatus(row.id, nextStatus);
      await fetchPurchases();
      showToast("Status updated successfully", "success");
    } catch (error) {
      console.error("Error updating order status", error);
      showToast(error);
    }
  };

  const confirmStatusChange = async () => {
    if (pendingOrder && pendingTransition) {
      await handleStatusChange(pendingOrder, pendingTransition);
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
            title={t.label}
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

  useEffect(() => {
    fetchPurchases();
  }, [page, statusFilter, sort, supplierId]);

  // Reset openPreview state after opening modal
  useEffect(() => {
    if (openPreviewFromSupplier && isPreviewOpen) {
      // Remove state from history so modal doesn't auto-open again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [openPreviewFromSupplier, isPreviewOpen, navigate, location.pathname]);

  const openPreview = (row) => {
    console.log("OPEN PREVIEW ID:", row);

    if (!row || !row.id || !row.supplierId) return;
    setPreviewOrderId(row.id);
    setPreviewSupplierId(row.supplierId);
    setIsPreviewOpen(true);
  };

  // Example: show a form to create order for supplierId, or a button to create from scratch
  return (
    <div className="page-container">
      <div className="container-top">
        <div className="container-title">
          <h1>Purchase Orders</h1>
          <h4>Manage your purchase orders and track supplier interactions.</h4>
        </div>

        <AddBtn
          icon={FaShoppingCart}
          action="New Order"
          description="Generate a new order"
          onClick={() => {
            // setIsPreviewOpen(true);
            // console.log("click!");
            setFormMode("create");
            setIsModalOpen(true);
          }}
          iconColor="#6c89ff"
          iconBgColor="#6c89ff81"
        />
      </div>

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

      <ConfirmPopup
        open={showConfirm}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of order #${pendingOrder?.order} to ${pendingTransition}?`}
        onConfirm={confirmStatusChange}
        onCancel={() => {
          setShowConfirm(false);
          setPendingOrder(null);
          setPendingTransition(null);
        }}
        confirmText="Confirm"
        cancelText="Cancel"
      />
      <div className="table-container">
        <LoadingOverlay visible={loading} text="Loading purchases..." />
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
                { label: "Pending", value: "pending" },
                { label: "Confirmed", value: "confirmed" },
                { label: "Received", value: "received" },
                { label: "Cancelled", value: "cancelled" },
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
          columns={purchaseColumns}
          data={purchases}
          onRowClick={openPreview}
          actions={purchasesActions}
        />

        {/* FOOTER */}
        <TableFooter
          page={page}
          pages={pages}
          total={purchases.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      <FormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formMode === "create" ? "Create Order" : "Edit Order"}
      >
        <SupplierSelectForm
          onClose={() => setIsModalOpen(false)}
          onSuccess={async (order) => {
            setIsModalOpen(false);
            await fetchPurchases();
            if (order && order.id_supplier_order) {
              setPreviewOrderId(order.id_supplier_order);
              setPreviewSupplierId(order.id_supplier);
              setIsPreviewOpen(true);
              if (order.active) {
                showToast("Order created successfully", "success");
              }
            }
          }}
        />
      </FormModal>

      {isPreviewOpen && (
        <OrderPreview
          orderId={previewOrderId}
          supplierId={previewSupplierId}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewSupplierId(null);
            setPreviewOrderId(null);
          }}
        />
      )}
    </div>
  );
}

export default Purchases;
