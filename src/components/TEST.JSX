import "./preview.css";
import { FaPowerOff } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

import { useEffect, useState } from "react";
import { getSupplierById } from "../../services/suppliers.service.js";
import { FaXmark } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";
import { componentColumns } from "../../configs/componentTable.config.jsx";
import {
  getComponentsBySupplierId,
  getComponentById,
  activateComponent,
} from "../../services/component.service.js";

// TABLE
import TableToolbar from "../TableToolbar.jsx";
import DataTable from "../DataTable/DataTable.jsx";
import TableFooter from "../TableFooter.jsx";

import LoadingOverlay from "../../components/ui/LoadingOverlay";

import AddBtn from "../addBtn.jsx";

function SupplierPreview({ supplierId, onClose }) {
  // BBDD
  const [components, setComponents] = useState([]);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  // const [total, setTotal] = useState(0);
  const limit = 5;

  //FILTERS
  // ACTIVE/INACTIVE
  const [statusFilter, setStatusFilter] = useState("all");

  // SORTING
  // NAME && LASTNAME
  const [sort, setSort] = useState({
    field: "name",
    order: "asc",
  });

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSupplier = async () => {
    try {
      const data = await getSupplierById(supplierId);
      setSupplier(data);
    } catch (error) {
      console.error("Error loading supplier preview:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComponents = async () => {
    try {
      setLoading(true);

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

      setComponents(mappedComponents);
      setPages(res.pages);
      // setTotal(res.total);
    } catch (error) {
      console.log("Error loading components ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supplierId) return;
    setSupplier(null);
    setLoading(true);

    fetchSupplier();
    fetchComponents();
  }, [page, statusFilter, sort, supplierId]);

  // PREVIEW
  // const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // const [previewSupplierId, setPreviewSupplierId] = useState(null);

  // const openPreview = (row) => {
  //   console.log("OPEN PREVIEW ID:", row.id);

  //   if (!row.id) return;
  //   setPreviewSupplierId(row.id);
  //   setIsPreviewOpen(true);
  // };

  // EDIT
  // const openEdit = async (row) => {
  //   try {
  //     setFormMode("edit");
  //     const fullSupplier = await getSupplierById(row.id);
  //     setSelectedSupplier(fullSupplier);
  //     setIsModalOpen(true);
  //   } catch (error) {
  //     console.error("Error fetching supplier details:", error);
  //   }
  // };

  // ACTIVATE/DEACTIVATE
  // const toggleActive = async (row) => {
  //   try {
  //     await activateSupplier(row.id);
  //     await fetchSuppliers();
  //   } catch (error) {
  //     console.error("Error activating supplier:", error);
  //   }
  // };

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

  if (loading || !supplier) {
    return <LoadingOverlay />;
  }

  return (
    <div className="preview-overlay" onClick={onClose}>
      <aside className="preview" onClick={(e) => e.stopPropagation()}>
        <header className="preview-header">
          <h2>{supplier.name} - Components</h2>
          <FaXmark className="preview-close" onClick={onClose} />
        </header>
        <div className="products-preview__container">
          <AddBtn
            icon={FaBox}
            action="Add Product"
            description="Register a new componentx"
            onClick={() => {
              setFormMode("create");
              setSelectedSupplier(null);
              setIsModalOpen(true);
            }}
            iconColor="#FF7621"
            iconBgColor="#f387447d"
          />

          <div className="table-container">
            <LoadingOverlay value={loading} text="Loading Products..." />
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
              columns={componentColumns}
              data={components}
              onRowClick={(row) => openPreview(row.original ?? row)}
              actions={suppliersActions}
            />
            {/* FOOTER */}
            <TableFooter
              page={page}
              totalPages={pages}
              total={components.length}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default SupplierPreview;
