import { useEffect, useRef, useState } from "react";
import { getSuppliers } from "../../services/suppliers.service";
import { getWarehouses } from "../../services/warehouse.service";
import { createSupplierOrder } from "../../services/supplierOrder.service";

// TODO: Change file name to SupplierOrderForm and import it correctly
function SupplierSelectForm({ onClose, onSuccess }) {
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [query, setQuery] = useState("");
  const [warehouseQuery, setWarehouseQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const wrapperRef = useRef(null);
  const warehouseWrapperRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getSuppliers({ status: "active", limit: 100 })
      .then((data) => {
        setSuppliers(Array.isArray(data) ? data : data.data || []);
      })
      .finally(() => setLoading(false));
    setLoadingWarehouses(true);
    getWarehouses({ status: "active", limit: 100 })
      .then((data) => {
        setWarehouses(Array.isArray(data) ? data : data.data || []);
      })
      .finally(() => setLoadingWarehouses(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (
        warehouseWrapperRef.current &&
        !warehouseWrapperRef.current.contains(e.target)
      ) {
        setShowWarehouseDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredWarehouses = warehouses.filter((w) =>
    w.name.toLowerCase().includes(warehouseQuery.toLowerCase()),
  );

  const handleSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setQuery(supplier.name);
    setShowDropdown(false);
    setError("");
  };
  const handleSelectWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseQuery(warehouse.name);
    setShowWarehouseDropdown(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSupplier || selectedSupplier.name !== query) {
      setError("Please select a valid supplier from the list");
      return;
    }
    if (!selectedWarehouse || selectedWarehouse.name !== warehouseQuery) {
      setError("Please select a valid warehouse from the list");
      return;
    }

    try {
      setSubmitting(true);
      const order = await createSupplierOrder({
        id_supplier: selectedSupplier.id_supplier,
        id_warehouse: selectedWarehouse.id_warehouse,
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

        <div className="form-row">
          {/* Supplier autocomplete */}
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
              className={error && !selectedSupplier ? "input-error" : ""}
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
                      className={`autocomplete-item ${selectedSupplier?.id_supplier === s.id_supplier ? "active" : ""}`}
                      onClick={() => handleSelect(s)}
                    >
                      {s.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Warehouse autocomplete */}
          <div className="form-field autocomplete" ref={warehouseWrapperRef}>
            <label>Warehouse</label>
            <input
              type="text"
              value={warehouseQuery}
              placeholder="Start typing warehouse name..."
              onFocus={() => setShowWarehouseDropdown(true)}
              onChange={(e) => {
                setWarehouseQuery(e.target.value);
                setSelectedWarehouse(null);
                setShowWarehouseDropdown(true);
                setError("");
              }}
              className={error && !selectedWarehouse ? "input-error" : ""}
              disabled={submitting}
            />
            {showWarehouseDropdown && (
              <div className="autocomplete-dropdown">
                {loadingWarehouses ? (
                  <div className="autocomplete-item muted">
                    Loading warehouses...
                  </div>
                ) : filteredWarehouses.length === 0 ? (
                  <div className="autocomplete-item muted">
                    No warehouses found
                  </div>
                ) : (
                  filteredWarehouses.map((w) => (
                    <div
                      key={w.id_warehouse}
                      className={`autocomplete-item ${selectedWarehouse?.id_warehouse === w.id_warehouse ? "active" : ""}`}
                      onClick={() => handleSelectWarehouse(w)}
                    >
                      {w.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {error && <span className="form-error">{error}</span>}
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
