import "../styles/customers.css";
import { useEffect, useState } from "react";
import { useToast } from "../components/ui/Toast";
import { FaUserGroup, FaArrowTrendUp, FaPowerOff } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

import AddBtn from "../components/addBtn";
import DashboardCard from "../components/DashboardCard";

// LOADING
import LoadingOverlay from "../components/ui/LoadingOverlay";

// FORM MODAL
import FormModal from "../components/Modals/FormModal.jsx";
import SupplierForm from "../components/Forms/SuppliersForm.jsx";

import CardTop from "../components/CardTop";

// SUPPLIERS TABLE
import TableToolbar from "../components/TableToolbar.jsx";
import DataTable from "../components/DataTable/DataTable";
import { supplierColumns } from "../configs/supplierTable.config.jsx";
import ConfirmPopup from "../components/Modals/ConfirmPopup.jsx";
import TableFooter from "../components/TableFooter.jsx";

// PREVIEW
import SupplierPreview from "../components/previews/SupplierPreview.jsx";

import {
  getSuppliers,
  getSupplierById,
  activateSupplier,
} from "../services/suppliers.service.js";

function Suppliers() {
  const { showToast } = useToast();
  //BBDD
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;

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
  const [formMode, setFormMode] = useState("create");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // CONFIRM POPUP
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSupplier, setPendingSupplier] = useState(null);

  // FETCH SUPPLIERS
  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const res = await getSuppliers({
        page,
        limit,
        status: statusFilter,
        sort: sort.field,
        order: sort.order,
      });

      const mappedSuppliers = res.data.map((s) => ({
        id: s.id_supplier,
        name: s.name,
        email: s.email,
        phone: s.phone,
        city: s.address?.province?.name ?? "-",
        status: s.active ? "Active" : "Inactive",
        active: s.active,
      }));

      setSuppliers(mappedSuppliers);
      setPages(res.pages);
      setTotal(res.total);
    } catch (error) {
      console.error("Error loading suppliers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, statusFilter, sort]);

  const suppliersActions = (row) => {
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
              setPendingSupplier(row);
              setShowConfirm(true);
            } else {
              toggleActive(row);
            }
          }}
        />
      </div>
    );
  };

  // PREVIEW
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSupplierId, setPreviewSupplierId] = useState(null);

  const openPreview = (row) => {
    console.log("OPEN PREVIEW ID:", row.id);

    if (!row.id) return;
    setPreviewSupplierId(row.id);
    setIsPreviewOpen(true);
  };

  // EDIT
  const openEdit = async (row) => {
    try {
      setFormMode("edit");
      const fullSupplier = await getSupplierById(row.id);
      setSelectedSupplier(fullSupplier);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching supplier details:", error);
    }
  };

  // ACTIVATE/DEACTIVATE
  const toggleActive = async (row) => {
    try {
      const res = await activateSupplier(row.id);
      await fetchSuppliers();
      showToast(res, "success");
    } catch (error) {
      showToast(error);
      console.error("Error activating supplier:", error);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (pendingSupplier) {
      await toggleActive(pendingSupplier);
      setPendingSupplier(null);
      setShowConfirm(false);
    }
  };

  // TODO: Change name to reuse css
  return (
    <div className="customers-container">
      <ConfirmPopup
        open={showConfirm}
        title="Confirm Deactivation"
        message="This supplier has active products. Are you sure you want to deactivate it?"
        onConfirm={handleConfirmDeactivate}
        onCancel={() => {
          setShowConfirm(false);
          setPendingSupplier(null);
        }}
        confirmText="Deactivate"
        cancelText="Cancel"
      />
      <div className="container-top">
        <div className="container-title">
          <h1>Suppliers</h1>
          <h4>Manage suppliers and their products</h4>
        </div>
        <AddBtn
          icon={FaUserGroup}
          action="Add Supplier"
          description="Register a new supplier"
          onClick={() => {
            setFormMode("create");
            setSelectedSupplier(null);
            setIsModalOpen(true);
          }}
          iconColor="#d752ce"
          iconBgColor="#ea7ce376"
        />
      </div>
      <div className="dashboard-cards">
        <DashboardCard
          title="Total suppliers"
          icon={FaUserGroup}
          iconBgColor="#00c24e"
          data={total}
          stats={3.4}
        />

        <DashboardCard
          title="Total products"
          icon={FaUserGroup}
          iconBgColor="#6C89FF"
          data="182"
          stats={-3}
        />

        <CardTop
          title="Most purchased products"
          icon={FaArrowTrendUp}
          iconBgColor="#f38744"
        />
      </div>

      <div className="table-container">
        <LoadingOverlay visible={loading} text="Loading suppliers..." />
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
          columns={supplierColumns}
          data={suppliers}
          onRowClick={(row) => openPreview(row.original ?? row)}
          actions={suppliersActions}
        />

        {/* FOOTER */}
        <TableFooter
          page={page}
          pages={pages}
          total={suppliers.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      <FormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formMode === "create" ? "Create Supplier" : "Edit Supplier"}
      >
        <SupplierForm
          mode={formMode}
          initialData={selectedSupplier}
          onClose={() => setIsModalOpen(false)}
          onSuccess={async () => {
            setIsModalOpen(false);
            await fetchSuppliers();
          }}
        />
      </FormModal>

      {isPreviewOpen && (
        <SupplierPreview
          supplierId={previewSupplierId}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewSupplierId(null);
          }}
        />
      )}
    </div>
  );
}

export default Suppliers;
