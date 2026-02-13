import "./customerForm.css";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import SuccessPopup from "../Modals/SuccessPopup";

const emptyForm = {
  min_stock: "",
  max_stock: "",
};

function InventoryForm({ initialData = null, onClose, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        min_stock: initialData.min_stock ?? "",
        max_stock: initialData.max_stock ?? "",
      });
    }
  }, [initialData]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // VALIDATIONS
  const validateForm = () => {
    const newErrors = {};

    const min = parseInt(form.min_stock);
    const max = parseInt(form.max_stock);

    if (form.min_stock === "") {
      newErrors.min_stock = "Minimum stock is required";
    } else if (isNaN(min) || min < 0) {
      newErrors.min_stock = "Minimum stock must be a non-negative integer";
    }

    if (form.max_stock === "") {
      newErrors.max_stock = "Maximum stock is required";
    } else if (isNaN(max) || max < 0) {
      newErrors.max_stock = "Maximum stock must be a non-negative integer";
    }

    if (!isNaN(min) && !isNaN(max) && min > max) {
      newErrors.min_stock =
        "Minimum stock cannot be greater than maximum stock";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) return;

    try {
      await api.put(
        `/component-inventories/${initialData.id_component}/${initialData.id_warehouse}`,
        {
          min_stock: form.min_stock.toString(),
          max_stock: form.max_stock.toString(),
        },
      );

      setSuccess(true);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unexpected error");
      }
    }
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <section className="form-section">
        <h3>Inventory Details</h3>

        <div className="form-grid">
          <div className="form-field">
            <label>Minimum Stock</label>
            <input
              type="number"
              min="0"
              value={form.min_stock}
              onChange={(e) => updateField("min_stock", e.target.value)}
              className={errors.min_stock ? "input-error" : ""}
            />
            {errors.min_stock && (
              <small className="form-field-error">{errors.min_stock}</small>
            )}
          </div>

          <div className="form-field">
            <label>Maximum Stock</label>
            <input
              type="number"
              min="0"
              value={form.max_stock}
              onChange={(e) => updateField("max_stock", e.target.value)}
              className={errors.max_stock ? "input-error" : ""}
            />
            {errors.max_stock && (
              <small className="form-field-error">{errors.max_stock}</small>
            )}
          </div>
        </div>
      </section>

      <div className="form-actions">
        {error && <div className="form-error">{error}</div>}

        <div className="form-actions__btns">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" type="submit">
            Update Inventory
          </button>
        </div>
      </div>

      <SuccessPopup
        open={success}
        title="Inventory Updated"
        message="The inventory configuration has been successfully updated."
        onClose={() => {
          setSuccess(false);
          onClose();
          onSuccess();
        }}
      />
    </form>
  );
}

export default InventoryForm;
