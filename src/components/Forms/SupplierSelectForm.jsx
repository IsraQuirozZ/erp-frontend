import { useEffect, useRef, useState } from "react";
import { getSuppliers } from "../../services/suppliers.service";
import { createSupplierOrder } from "../../services/supplierOrder.service";

function SupplierSelectForm({ onClose, onSuccess }) {
  const [suppliers, setSuppliers] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const wrapperRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getSuppliers({ status: "active", limit: 100 })
      .then((data) => {
        setSuppliers(Array.isArray(data) ? data : data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setQuery(supplier.name);
    setShowDropdown(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSupplier || selectedSupplier.name !== query) {
      setError("Please select a valid supplier from the list");
      return;
    }

    try {
      setSubmitting(true);

      const order = await createSupplierOrder({
        id_supplier: selectedSupplier.id_supplier,
      });

      onSuccess?.(order);
    } catch (err) {
      setError(
        err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.response?.data ??
          err?.message ??
          "Error creating supplier order",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Create supplier order</h3>

        <div className="form-field autocomplete" ref={wrapperRef}>
          <label>Supplier</label>

          <input
            type="text"
            value={query}
            placeholder="Start typing supplier name..."
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedSupplier(null);
              setShowDropdown(true);
              setError("");
            }}
            className={error ? "input-error" : ""}
            disabled={submitting}
          />

          {showDropdown && (
            <div className="autocomplete-dropdown">
              {loading ? (
                <div className="autocomplete-item muted">
                  Loading suppliers...
                </div>
              ) : filteredSuppliers.length === 0 ? (
                <div className="autocomplete-item muted">
                  No suppliers found
                </div>
              ) : (
                filteredSuppliers.map((s) => (
                  <div
                    key={s.id_supplier}
                    className={`autocomplete-item ${
                      selectedSupplier?.id_supplier === s.id_supplier
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleSelect(s)}
                  >
                    {s.name}
                  </div>
                ))
              )}
            </div>
          )}

          {error && <span className="form-error">{error}</span>}
        </div>
      </div>

      <div className="form-actions">
        <div className="form-actions__btns">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create order"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SupplierSelectForm;
