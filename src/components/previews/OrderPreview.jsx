import "./preview.css";
import { useEffect, useState, useRef } from "react";
import { IoIosCloseCircle, IoIosAddCircle } from "react-icons/io";
import { FaTrash } from "react-icons/fa";

import AddBtn from "../addBtn.jsx";
import FormModal from "../Modals/FormModal.jsx";
import LoadingOverlay from "../ui/LoadingOverlay";
import { useToast } from "../ui/Toast.jsx";

import { orderItemsColumns } from "../../configs/orderItemsTable.config.jsx";
import TableToolbar from "../TableToolbar.jsx";
import DataTable from "../DataTable/DataTable.jsx";
import TableFooter from "../TableFooter.jsx";

// TODO: Import services for orders, items, suppliers, products

function OrderPreview({ orderId, supplierId, onClose }) {
  // States for order, supplier, items, etc.
  const [closing, setClosing] = useState(false);
  const asideRef = useRef(null);

  // TABLE
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const limit = 5;

  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ field: "name", order: "asc" });
  const [tableLoading, setTableLoading] = useState(false);

  //
  const [items, setItems] = useState([]);

  // UI/UX logic for modal slider, loading, etc.

  const handleClose = () => {
    setClosing(true);
  };

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

  // Actions
  const itemsActions = (row) => {
    return (
      <div className="table-actions">
        <FaTrash
          size={20}
          className="table-actions__icon icon-edit"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            openEdit(row);
          }}
        />
      </div>
    );
  };

  return (
    <div className="preview-overlay" onClick={handleClose}>
      <aside
        ref={asideRef}
        className={`preview${closing ? " slide-out" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview__header">
          <h2>{!orderId ? "New Order" : `Order #${orderId} - Items`}</h2>
        </div>
        <div className="preview__header-actions">
          <AddBtn
            icon={IoIosAddCircle}
            action="Add Item"
            description="Add items to this order"
            onClick={() => {
              console.log("Add Item");
            }}
            iconColor="#6c89ff"
            iconBgColor="#6c89ff81"
          />
        </div>
        <div className="table-container">
          <LoadingOverlay visible={tableLoading} text="Loading items..." />
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
            columns={orderItemsColumns}
            data={items}
            actions={itemsActions}
          />

          <TableFooter
            page={page}
            totalPages={pages}
            total={items.length}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
        <button className="close-btn" onClick={handleClose}>
          <IoIosCloseCircle size={50} />
        </button>
      </aside>
    </div>
  );
}

export default OrderPreview;
