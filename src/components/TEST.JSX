import "./preview.css";
import { useEffect, useState, useRef } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import AddBtn from "../addBtn.jsx";
import FormModal from "../Modals/FormModal.jsx";
import LoadingOverlay from "../ui/LoadingOverlay";
import { useToast } from "../ui/Toast.jsx";

// TODO: Import services for orders, items, suppliers, products

function OrderPreview({ orderId, supplierId, onClose }) {
  // States
  const [supplier, setSupplier] = useState(null);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [closing, setClosing] = useState(false);
  const [newItem, setNewItem] = useState({
    product: "",
    quantity: 1,
    price: 0,
    tax: 0,
    discount: 0,
  });

  // Layout
  const asideRef = useRef(null);
  const { showToast } = useToast();

  // Fetch suppliers for dropdown
  useEffect(() => {
    // TODO: fetch suppliers matching supplierSearch
    // setSupplierOptions([...]);
  }, [supplierSearch]);

  // Fetch order/items if orderId exists
  useEffect(() => {
    // TODO: fetch order and items
  }, [orderId]);

  // Calculate subtotal for each item
  const calcSubtotal = (item) => {
    return (
      Number(item.price) * Number(item.quantity) +
      Number(item.tax) -
      Number(item.discount)
    ).toFixed(2);
  };

  // Add new item to list
  const handleAddItem = () => {
    setItems([...items, { ...newItem, subtotal: calcSubtotal(newItem) }]);
    setNewItem({ product: "", quantity: 1, price: 0, tax: 0, discount: 0 });
    setAddingItem(false);
  };

  // Total order
  const orderTotal = items
    .reduce((sum, item) => sum + Number(item.subtotal), 0)
    .toFixed(2);

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

  return (
    <div className="preview-overlay" onClick={onClose}>
      <aside
        ref={asideRef}
        className={`preview${closing ? " slide-out" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview__header">
          <h2>Order Preview</h2>
          <button className="close-btn" onClick={onClose}>
            <IoIosCloseCircle size={40} />
          </button>
        </div>
        <div className="preview__header-actions">
          {/* Supplier search input */}
          <input
            type="text"
            placeholder="Search supplier by name or email"
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
            style={{ width: 280, marginRight: 12 }}
          />
          {/* Dropdown options (mock) */}
          {supplierOptions.length > 0 && (
            <div className="dropdown">
              {supplierOptions.map((opt) => (
                <div key={opt.id} onClick={() => setSupplier(opt)}>
                  {opt.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="preview-content">
          {/* Items table */}
          <table style={{ width: "100%", marginBottom: 16 }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Tax</th>
                <th>Discount</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.product}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.tax}</td>
                  <td>{item.discount}</td>
                  <td>{item.subtotal}</td>
                  <td>
                    <button
                      onClick={() =>
                        setItems(items.filter((_, i) => i !== idx))
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {addingItem && (
                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="Product name"
                      value={newItem.product}
                      onChange={(e) =>
                        setNewItem({ ...newItem, product: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem({ ...newItem, quantity: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={newItem.tax}
                      onChange={(e) =>
                        setNewItem({ ...newItem, tax: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={newItem.discount}
                      onChange={(e) =>
                        setNewItem({ ...newItem, discount: e.target.value })
                      }
                    />
                  </td>
                  <td>{calcSubtotal(newItem)}</td>
                  <td>
                    <button onClick={handleAddItem}>Add</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <button onClick={() => setAddingItem(true)}>Add Item</button>
          <div style={{ marginTop: 16, fontWeight: "bold" }}>
            Total: {orderTotal} €
          </div>
        </div>
        {/* Confirm/complete order button */}
        <button style={{ marginTop: 24 }}>Confirm Order</button>
      </aside>
    </div>
  );
}

export default OrderPreview;
