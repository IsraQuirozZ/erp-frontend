import "./preview.css";
import { useEffect, useState, useRef, use } from "react";
import { IoIosCloseCircle, IoIosAddCircle } from "react-icons/io";
import { FaCheckCircle, FaTrash } from "react-icons/fa";

import AddBtn from "../addBtn.jsx";
import FormModal from "../Modals/FormModal.jsx";
import LoadingOverlay from "../ui/LoadingOverlay";
import { useToast } from "../ui/Toast.jsx";

import {
  getOrderItems,
  createOrderItem,
  deleteOrderItem,
} from "../../services/supplierOrderItem.service.js";
import { getComponentsBySupplierId } from "../../services/component.service.js";
import { orderItemsColumns } from "../../configs/orderItemsTable.config.jsx";
import TableToolbar from "../TableToolbar.jsx";
import DataTable from "../DataTable/DataTable.jsx";
import TableFooter from "../TableFooter.jsx";

// TODO: Import services for orders, items, suppliers, products

function OrderPreview({ orderId, supplierId, onClose }) {
  // States for order, supplier, items, etc.
  const [closing, setClosing] = useState(false);
  const asideRef = useRef(null);
  const [editingItems, setEditingItems] = useState({});
  const [items, setItems] = useState([]);

  const { showToast } = useToast();

  // TABLE
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const limit = 5;

  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ field: "name", order: "asc" });
  const [tableLoading, setTableLoading] = useState(false);

  //
  // Inline add item state
  const [components, setComponents] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

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

      const res = await getComponentsBySupplierId(supplierId, {
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
    if (!supplierId) return;
    fetchComponents();
  }, [supplierId]);

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

      // SET INLINE ADD "FORM
      setQuery("");
      setSelectedComponent(null);
      setQuantity(1);
      setTax("");
      setDiscount("");
    } catch (error) {
      showToast("Error adding item", "error");
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
        ...row,
        ...prev[key],
        ...changes,
      },
    }));
  };

  const handleApply = async (row) => {
    const key = `${row.id_supplier_order}-${row.id_component}`;
    const edited = editingItems[key];

    console.log("APPLY TO BACKEND:", edited);

    // luego:
    // await updateSupplierOrderItem(...)
    // await fetchItems()

    setEditingItems((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
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
      showToast("Error deleting item", "error");
    }
  };

  // Actions
  const itemsActions = (row) => {
    return (
      <div className="table-actions">
        <FaCheckCircle
          size={20}
          className="table-actions__icon icon-edit"
          title="Apply"
          onClick={(e) => {
            e.stopPropagation();
            openEdit(row);
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

  return (
    <div className="preview-overlay" onClick={handleClose}>
      <aside
        ref={asideRef}
        className={`preview${closing ? " slide-out" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview__header">
          <h2>{!orderId ? "New Order" : `Order #${orderId} - Items`}</h2>
          <h2>Supplier</h2>
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
          {/*  INLINE ADD ROW */}
          <div className="inline-add-row">
            {/* COMPONENT AUTOCOMPLETE */}
            <div className="inline-field autocomplete" ref={autocompleteRef}>
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
            <div className="inline-field qty">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
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

            {/* UNIT PRICE */}
            <div className="inline-field readonly">
              {selectedComponent ? `${selectedComponent.price} €` : "—"}
            </div>

            {/* TAXES */}
            <div className="inline-field">
              <input
                type="number"
                placeholder="% Tax"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
              />
            </div>

            {/* DISCOUNT */}
            <div className="inline-field">
              <input
                type="number"
                placeholder="% Disc"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
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
          <DataTable
            columns={orderItemsColumns({
              editingItems,
              onChange: handleEditChange,
              onApply: handleApply,
              onDelete: handleDelete,
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
        <button className="close-btn" onClick={handleClose}>
          <IoIosCloseCircle size={50} />
        </button>
      </aside>
    </div>
  );
}

export default OrderPreview;
