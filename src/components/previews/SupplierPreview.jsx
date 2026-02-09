import "./preview.css";
import { useEffect, useState, useRef } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaEdit, FaBox, FaShoppingCart } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";
import { useToast } from "../ui/Toast.jsx";

import { getSupplierById } from "../../services/suppliers.service.js";
import {
  getComponentsBySupplierId,
  getComponentById,
  activateComponent,
} from "../../services/component.service.js";
import { createSupplierOrder } from "../../services/supplierOrder.service.js";

import { componentColumns } from "../../configs/componentTable.config.jsx";

import FormModal from "../Modals/FormModal.jsx";
import ComponentForm from "../Forms/ComponentForm.jsx";

// TABLE
import TableToolbar from "../TableToolbar.jsx";
import DataTable from "../DataTable/DataTable.jsx";
import TableFooter from "../TableFooter.jsx";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import AddBtn from "../addBtn.jsx";
import { useNavigate } from "react-router-dom";

function SupplierPreview({ supplierId, onClose }) {
  const navigate = useNavigate();
  const [closing, setClosing] = useState(false);
  const asideRef = useRef(null);
  const { showToast } = useToast();

  //  STATES
  const [supplier, setSupplier] = useState(null);
  const [components, setComponents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedComponent, setSelectedComponent] = useState(null);

  // TABLE
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const limit = 5;

  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ field: "name", order: "asc" });

  // LOADING
  const [tableLoading, setTableLoading] = useState(false);

  // FETCH
  const fetchSupplier = async () => {
    try {
      const data = await getSupplierById(supplierId);
      setSupplier(data);
    } catch (error) {
      console.error("Error loading supplier:", error);
    }
  };

  const fetchComponents = async () => {
    try {
      setTableLoading(true);

      const res = await getComponentsBySupplierId(supplierId, {
        page,
        limit,
        status: statusFilter,
        sort: sort.field,
        order: sort.order,
      });

      const mappedComponents = res.data.map((c) => ({
        id: c.id_component,
        name: c.name,
        price: c.price,
        description: c.description,
        supplier: c.supplier?.name ?? "-",
        status: c.active ? "Active" : "Inactive",
        active: c.active,
      }));

      // const filtered = mapped.filter((c) => c.supplier.name === supplier.name);

      setComponents(mappedComponents);
      setPages(res.pages);
    } catch (error) {
      console.error("Error loading components:", error);
    } finally {
      setTableLoading(false);
    }
  };

  // When supplierId changes
  useEffect(() => {
    if (!supplierId) return;

    setSupplier(null);
    setComponents([]);
    setPage(1);

    fetchSupplier();
  }, [supplierId]);

  // When page, statusFilter, or sort changes
  useEffect(() => {
    if (!supplierId) return;
    fetchComponents();
  }, [page, statusFilter, sort]);

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    if (newPage > pages) return;
    setPage(newPage);
  };

  // EDIT
  const openEdit = async (row) => {
    try {
      setFormMode("edit");
      const editComponent = await getComponentById(row.id);
      setSelectedComponent(editComponent);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching component details:", error);
    }
  };

  // ACTIVATE/DEACTIVATE
  const toggleActive = async (row) => {
    try {
      const res = await activateComponent(row.id);
      await fetchComponents();
      showToast(res, "success");
    } catch (error) {
      showToast(error);
      console.error("Error activating component:", error);
    }
  };

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
            toggleActive(row);
          }}
        />
      </div>
    );
  };

  if (!supplierId) return null;

  const handleClose = () => {
    setClosing(true);
  };

  // When closing animation ends, call onClose
  useEffect(() => {
    if (!closing) return;
    const aside = asideRef.current;
    if (!aside) return;
    const handleAnimationEnd = () => {
      onClose();
    };
    aside.addEventListener("animationend", handleAnimationEnd);
    return () => aside.removeEventListener("animationend", handleAnimationEnd);
  }, [closing, onClose]);

  // TODO: If order already exist and status === PENDING, open that order instead of creating a new one
  const handleCreateOrder = async () => {
    try {
      await createSupplierOrder({
        id_supplier: supplierId,
      });

      showToast("Supplier order created successfully", "success");

      navigate("/app/purchases", {
        state: { supplierId, openPreview: true },
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error creating supplier order";

      showToast(message, "error");
    }
  };

  return (
    <div className="preview-overlay" onClick={handleClose}>
      <aside
        ref={asideRef}
        className={`preview${closing ? " slide-out" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview__header">
          <h2>{supplier ? `${supplier.name} - Products` : "Loading..."}</h2>
        </div>
        <div className="preview__header-actions">
          <AddBtn
            icon={FaBox}
            action="Add Product"
            description="Register a new product"
            onClick={() => {
              setFormMode("create");
              setSelectedComponent(null);
              setIsModalOpen(true);
            }}
            iconColor="#FF7621"
            iconBgColor="#f387447d"
          />
          {components.some((component) => component.active) && (
            <AddBtn
              icon={FaShoppingCart}
              action="Create Order"
              description="Generate a new order"
              onClick={handleCreateOrder}
              iconColor="#6c89ff"
              iconBgColor="#6c89ff81"
            />
          )}
        </div>

        {components.length === 0 ? (
          <p className="no-data-text">
            This Supplier does not have any products.
          </p>
        ) : (
          <div className="table-container">
            <LoadingOverlay value={tableLoading} text="Loading components..." />

            <TableToolbar
              placeholder="Search by name"
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

            <DataTable
              columns={componentColumns}
              data={components}
              actions={suppliersActions}
            />

            <TableFooter
              page={page}
              totalPages={pages}
              total={components.length}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <button className="close-btn" onClick={handleClose}>
          <IoIosCloseCircle size={50} />
        </button>
      </aside>
      <div onClick={(e) => e.stopPropagation()}>
        <FormModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={formMode === "create" ? "Create Product" : "Edit Product"}
        >
          <ComponentForm
            mode={formMode}
            initialData={selectedComponent}
            id_supplier={supplierId}
            onClose={() => setIsModalOpen(false)}
            onSuccess={async () => {
              setIsModalOpen(false);
              await fetchComponents();
            }}
          />
        </FormModal>
      </div>
    </div>
  );
}

export default SupplierPreview;
