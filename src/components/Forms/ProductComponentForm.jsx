import { useState, useEffect, useRef } from "react";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { useToast } from "../ui/Toast.jsx";

import { getAllComponents } from "../../services/component.service.js";
import {
  createProductComponent,
  updateProductComponent,
} from "../../services/productComponent.service.js";

function ProductComponentForm({
  mode = "create",
  productId,
  initialData = null,
  onClose,
  onSuccess,
}) {
  const { showToast } = useToast();

  const [components, setComponents] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setSelectedComponent({
        id_component: initialData.id_component,
        name: initialData.component?.name,
      });

      setQuery(initialData.component?.name || "");
      setQuantity(initialData.quantity);
    }
  }, [mode, initialData]);

  // ACTIVE COMPONENTS
  useEffect(() => {
    if (mode !== "create") return;

    setLoading(true);

    getAllComponents()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setComponents(list);
      })
      .finally(() => setLoading(false));
  }, [mode]);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredComponents = components.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (component) => {
    setSelectedComponent(component);
    setQuery(component.name);
    setShowDropdown(false);
    setError("");
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedComponent || selectedComponent.name !== query) {
      setError("Please select a valid component from the list");
      return;
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    try {
      setError("");

      if (mode === "create") {
        await createProductComponent({
          id_product: productId,
          id_component: selectedComponent.id_component,
          quantity: quantity,
        });

        showToast("Component added successfully", "success");
      }

      if (mode === "edit") {
        await updateProductComponent(
          productId,
          selectedComponent.id_component,
          quantity,
        );

        showToast("Component updated successfully", "success");
      }

      onSuccess?.();
      showToast("Component added to product successfully", "success");
    } catch (err) {
      setError(
        err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.message ??
          "Error adding component",
      );
    }
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Add Component</h3>

        <div className="form-row">
          <div className="form-field autocomplete" ref={wrapperRef}>
            <label>Component</label>
            <input
              type="text"
              value={query}
              placeholder="Search component"
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedComponent(null);
                setShowDropdown(true);
                setError("");
              }}
              disabled={mode === "edit"}
              className={error ? "input-error" : ""}
            />

            {mode === "create" && showDropdown && (
              <div className="autocomplete-dropdown">
                {loading ? (
                  <div className="autocomplete-item muted">
                    Loading components...
                  </div>
                ) : filteredComponents.length === 0 ? (
                  <div className="autocomplete-item muted">
                    No components found
                  </div>
                ) : (
                  filteredComponents.map((c) => (
                    <div
                      key={c.id_component}
                      className={`autocomplete-item ${
                        selectedComponent?.id_component === c.id_component
                          ? "active"
                          : ""
                      }`}
                      onClick={() => handleSelect(c)}
                    >
                      {c.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-field">
          <label>Quantity</label>
          <div className="form-field-counter">
            <IoRemoveCircle
              size={35}
              color="#4f27ee"
              className="counterBtn"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            />
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />{" "}
            <IoAddCircle
              size={35}
              color="#4f27ee"
              className="counterBtn"
              onClick={() => setQuantity((prev) => prev + 1)}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions__btns">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button type="submit" className="btn-primary">
            {mode === "create" ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ProductComponentForm;
