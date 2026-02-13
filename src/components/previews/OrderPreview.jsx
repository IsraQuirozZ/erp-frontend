import "./preview.css";
import { useEffect, useState, useRef } from "react";
import { IoIosCloseCircle, IoIosAddCircle } from "react-icons/io";
import { FaCheckCircle, FaTrash, FaEye } from "react-icons/fa";

import AddBtn from "../addBtn.jsx";
import LoadingOverlay from "../ui/LoadingOverlay";
import InvoicePreview from "./InvoicePreview.jsx";
import { useToast } from "../ui/Toast.jsx";

import {
  getOrderItems,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from "../../services/supplierOrderItem.service.js";
import { getComponentsBySupplierId } from "../../services/component.service.js";
import {
  createSupplierInvoice,
  updateInvoiceStatus,
} from "../../services/invoice.service.js";
import { getSupplierOrderById } from "../../services/supplierOrder.service.js";
import { orderItemsColumns } from "../../configs/orderItemsTable.config.jsx";
import TableToolbar from "../TableToolbar.jsx";
import DataTable from "../DataTable/DataTable.jsx";
import TableFooter from "../TableFooter.jsx";

const invoiceTransitions = {
  DRAFT: [
    { label: "Issue", next: "ISSUED", color: "#6c89ff" },
    { label: "Cancel", next: "CANCELLED", color: "#dc3545" },
  ],
  ISSUED: [
    { label: "Mark as Paid", next: "PAID", color: "#00c24e" },
    { label: "Cancel", next: "CANCELLED", color: "#dc3545" },
  ],
  CANCELLED: [],
  PAID: [],
};

function OrderPreview({ orderId, onClose }) {
  // States for order, supplier, items, invoice.
  const [order, setOrder] = useState(null);

  const [closing, setClosing] = useState(false);
  const asideRef = useRef(null);
  const [editingItems, setEditingItems] = useState({});
  const [items, setItems] = useState([]);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  const isEditable = order?.status === "PENDING";
  const invoice =
    order?.invoices?.find((i) => i.status !== "CANCELLED") ||
    order?.invoices?.[0] ||
    null;

  const { showToast } = useToast();

  // TABLE
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const limit = 5;

  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ field: "name", order: "asc" });
  const [tableLoading, setTableLoading] = useState(false);

  // Inline add item state
  const [components, setComponents] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  // FETCHING
  const fetchOrder = async () => {
    try {
      const res = await getSupplierOrderById(orderId);
      setOrder(res);
    } catch (error) {
      console.error("Error loading order:", error);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
  }, [orderId]);

  const fetchItems = async () => {
    try {
      setTableLoading(true);
      const res = await getOrderItems(orderId, {
        page,
        limit,
        sort: sort.field,
        order: sort.order,
      });

      const mappedItems = res.data.map((i) => ({
        id_supplier_order: i.id_supplier_order,
        id_component: i.id_component,
        name: i.component.name,
        quantity: i.quantity,
        unit_price: i.unit_price,
        tax: i.tax,
        discount: i.discount,
        subtotal: i.subtotal,
      }));

      setItems(mappedItems);
      setPages(res.pages);
    } catch (error) {
      console.error("Error loading order items:", error);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    fetchItems();
  }, [page, sort]);

  const fetchComponents = async () => {
    try {
      setTableLoading(true);

      const res = await getComponentsBySupplierId(order.id_supplier, {
        page,
        limit,
        status: statusFilter,
        sort: sort.field,
        order: sort.order,
      });

      const mappedComponents = res.data.map((c) => ({
        id_supplier_order: c.id_supplier_order,
        id_component: c.id_component,
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

  useEffect(() => {
    if (!order?.id_supplier) return;
    fetchComponents();
  }, [order?.id_supplier]);

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

  // ADD ITEM
  const handleAddItem = async () => {
    if (!selectedComponent) return;

    try {
      setTableLoading(true);
      const supplierOrderId = orderId.toString();
      const componentId = selectedComponent.id_component;

      await createOrderItem({
        id_supplier_order: supplierOrderId,
        id_component: componentId.toString(),
        quantity: quantity.toString(),
        tax: tax || undefined,
        discount: discount || undefined,
      });
      await fetchItems();

      showToast(
        `Item "${selectedComponent.name}" added successfully`,
        "success",
      );
      // SET INLINE ADD "FORM
      setQuery("");
      setSelectedComponent(null);
      setQuantity(1);
      setTax(0);
      setDiscount(0);
    } catch (error) {
      showToast(error, "error");
      console.error("Error adding item", error);
    } finally {
      setTableLoading(false);
    }
  };

  // UPDATE ITEM
  const handleEditChange = (row, changes) => {
    const key = `${row.id_supplier_order}-${row.id_component}`;

    setEditingItems((prev) => ({
      ...prev,
      [key]: {
        quantity: prev[key]?.quantity ?? row.quantity,
        tax: prev[key]?.tax ?? row.tax,
        discount: prev[key]?.discount ?? row.discount,
        ...changes,
      },
    }));
  };

  // HANDLE APPLY (SAVE) EDITS
  const handleApply = async (row) => {
    const key = `${row.id_supplier_order}-${row.id_component}`;
    const edited = editingItems[key];

    if (!edited) return;

    try {
      setTableLoading(true);

      await updateOrderItem(row.id_supplier_order, row.id_component, {
        id_supplier_order: row.id_supplier_order,
        id_component: row.id_component,
        quantity: edited.quantity.toString(),
        tax: edited.tax,
        discount: edited.discount,
      });

      await fetchItems();

      showToast(`Item "${row.name}" updated successfully`, "success");
      setEditingItems((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    } catch (error) {
      showToast(error, "error");
    } finally {
      setTableLoading(false);
    }
  };

  // DELETE ITEM
  const handleDelete = async (row) => {
    console.log("DELETE:", row);
    try {
      const res = await deleteOrderItem({
        id_supplier_order: row.id_supplier_order,
        id_component: row.id_component,
      });
      await fetchItems();
      showToast(res, "success");
    } catch (error) {
      showToast(error, "error");
    }
  };

  // Actions
  const itemsActions = (row) => {
    if (!isEditable) return null;
    return (
      <div className="table-actions">
        <FaCheckCircle
          size={20}
          className="table-actions__icon icon-apply"
          title="Apply"
          onClick={(e) => {
            e.stopPropagation();
            handleApply(row);
          }}
        />
        <FaTrash
          size={20}
          className="table-actions__icon icon-delete"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row);
          }}
        />
      </div>
    );
  };

  const autocompleteRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // CREATE INVOICE
  const handleCreateInvoice = async () => {
    try {
      await createSupplierInvoice(orderId);
      await fetchOrder();
      showToast("Invoice created successfully", "success");
    } catch (error) {
      showToast(error, "error");
    }
  };

  // HANDLE UPDATE INVOICE STATUS
  const handleInvoiceStatusChange = async (newStatus) => {
    try {
      await updateInvoiceStatus(invoice.id_supplier_invoice, newStatus);
      await fetchOrder();
      showToast("Invoice status updated", "success");
    } catch (error) {
      showToast(error, "error");
    }
  };

  return (
    <div className="preview-overlay" onClick={handleClose}>
      <aside
        ref={asideRef}
        className={`preview${closing ? " slide-out" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview__header-info">
          <div className="order-info">
            <div>
              <strong>Order Number:</strong> {orderId || "—"}
            </div>
            {/* TODO: Show supplier name */}
            <div>
              <strong>Supplier:</strong> {order?.supplier?.name || "—"}
            </div>
            <div>
              <strong>Warehouse:</strong> {order?.warehouse?.name || "—"}
            </div>
            {invoice ? (
              <>
                <div>
                  <strong>Invoice Number:</strong> {invoice.invoice_number}
                </div>
                <div>
                  <strong>Created Date:</strong>{" "}
                  {invoice.created_at.split("T")[0]}
                </div>
                <div>
                  <strong>Total:</strong> {invoice.total} €
                </div>
                <div className="invoice-options">
                  <div
                    className={`status status-${invoice.status.toLowerCase()}`}
                  >
                    {invoice.status}
                  </div>

                  {(invoiceTransitions[invoice.status] || []).map((t) => (
                    <button
                      key={t.next}
                      style={{
                        background: t.color,
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInvoiceStatusChange(t.next);
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <small>No invoice available</small>
              </>
            )}
          </div>

          <div className="preview__header-actions">
            {!invoice || invoice.status === "CANCELLED" ? (
              <AddBtn
                icon={IoIosAddCircle}
                action="Create Invoice"
                description="Generate invoice"
                onClick={() => {
                  handleCreateInvoice();
                }}
                iconColor="#20C598"
                iconBgColor="#20c59947"
              />
            ) : (
              <AddBtn
                icon={FaEye}
                action="See Invoice"
                description="View invoice details"
                onClick={() => setShowInvoicePreview(true)}
                iconColor="#20C598"
                iconBgColor="#20c59947"
              />
            )}
          </div>
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

          {/*  INLINE ADD ROW */}
          {isEditable && (
            <div className="inline-add-row">
              {/* COMPONENT AUTOCOMPLETE */}
              <div className="inline-field autocomplete" ref={autocompleteRef}>
                <div className="inline-field">
                  <small>Product</small>
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={query}
                    onFocus={() => setShowDropdown(true)}
                    onClick={() => setShowDropdown(true)}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedComponent(null);
                      setShowDropdown(true);
                    }}
                  />
                </div>

                {showDropdown && (
                  <div className="autocomplete-dropdown">
                    {components
                      .filter((c) =>
                        c.name.toLowerCase().includes(query.toLowerCase()),
                      )
                      .map((c) => (
                        <div
                          key={c.id_component}
                          className="autocomplete-item"
                          onClick={() => {
                            setSelectedComponent(c);
                            setQuery(c.name);
                            setShowDropdown(false);
                          }}
                        >
                          {c.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* QUANTITY */}
              <div className="inline-field">
                <small>Quantity</small>
                <div className="inline-field qty">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                </div>
              </div>

              {/* UNIT PRICE */}
              <div className="inline-field">
                <small>U.Price</small>
                <div className="inline-field readonly">
                  {selectedComponent ? `${selectedComponent.price} €` : "—"}
                </div>
              </div>

              {/* TAXES */}
              <div className="inline-field">
                <small>Taxes</small>
                <div className="inline-field">
                  <input
                    type="number"
                    placeholder="% Tax"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* DISCOUNT */}
              <div className="inline-field">
                <small>Discount</small>
                <div className="inline-field">
                  <input
                    type="number"
                    placeholder="% Disc"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
              </div>
              {/* ADD ACTION */}
              <div className="inline-field action">
                <button
                  className="btn-primary"
                  disabled={!selectedComponent || quantity <= 0}
                  onClick={handleAddItem}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* TABLE */}
          <DataTable
            columns={orderItemsColumns({
              editingItems,
              onChange: handleEditChange,
              onApply: handleApply,
              onDelete: handleDelete,
              isEditable,
            })}
            data={items}
            actions={itemsActions}
          />
          <TableFooter
            page={page}
            totalPages={pages}
            total={components.length}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
        <div className="orderPreview__total">
          <h4>TOTAL:</h4>
          <h4>{order?.total}€</h4>
        </div>
        <button className="close-btn" onClick={handleClose}>
          <IoIosCloseCircle size={50} />
        </button>
      </aside>

      {showInvoicePreview && (
        <InvoicePreview
          invoice={invoice}
          onClose={() => {
            setShowInvoicePreview(false);
          }}
        />
      )}
    </div>
  );
}

export default OrderPreview;
