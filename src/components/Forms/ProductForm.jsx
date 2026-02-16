import "./customerForm.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import SuccessPopup from "../Modals/SuccessPopup.jsx";

const emptyForm = {
  name: "",
  price: "",
  description: "",
};

function ProductForm({
  mode = "create", // "create" | "edit"
  initialData = null,
  onClose,
  onSuccess,
}) {
  // FRONT ERRORS
  const [errors, setErrors] = useState({});

  // BACK ERRORS & SUCCESS
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState(emptyForm);

  /* ───────────── LOAD DATA FOR EDIT ───────────── */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        price: initialData.price || "",
        description: initialData.description || "",
      });
    }
  }, [mode, initialData]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // VALIDATIONS
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Product name must be less than 100 characters";
    } else if (!/^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(form.name.trim())) {
      newErrors.name = "Product name can only contain letters and numbers";
    }

    if (!form.price.toString().trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(form.price) || Number(form.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.price.toString().trim())) {
      newErrors.price = "Price can have up to 2 decimal places";
    }

    if (form.description && form.description.trim()) {
      if (form.description.trim().length < 3) {
        newErrors.description = "Description must be at least 3 characters";
      } else if (form.description.trim().length > 500) {
        newErrors.description = "Description must be less than 500 characters";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ───────────── SUBMIT ───────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) return;

    try {
      if (mode === "create") {
        await api.post("/products", {
          ...form,
        });
      } else {
        await api.put(`/products/${initialData.id_product}`, form);
      }

      setSuccess(true);
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Unexpected error");
      }
    }
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      {/* ───────────── SUPPLIER INFO ───────────── */}
      <section className="form-section">
        <h3>Product Information</h3>

        <div className="form-grid">
          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Cristal Bottle"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && (
              <small className="form-field-error">{errors.name}</small>
            )}
          </div>

          <div className="form-field">
            <label>Price</label>
            <input
              type="text"
              placeholder="10.00"
              value={form.price}
              className={errors.price ? "input-error" : ""}
              onChange={(e) => updateField("price", e.target.value)}
            />
            {errors.price && (
              <small className="form-field-error">{errors.price}</small>
            )}
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              placeholder="Product description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={errors.description ? "input-error" : ""}
              rows={3}
            />
            {errors.description && (
              <small className="form-field-error">{errors.description}</small>
            )}
          </div>
        </div>
      </section>

      {/* ───────────── ACTIONS ───────────── */}
      <div className="form-actions">
        {error && <div className="form-error">{error}</div>}
        <div className="form-actions__btns">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" type="submit">
            {mode === "create" ? "Create Product" : "Update Product"}
          </button>
        </div>
      </div>

      {/* ───────────── POPUP ───────────── */}
      <SuccessPopup
        open={success}
        title={mode === "create" ? "Product Created" : "Product Updated"}
        message={
          mode === "create"
            ? "The component has been successfully created."
            : "The component has been successfully updated."
        }
        onClose={() => {
          setSuccess(false);
          onClose();
          onSuccess();
        }}
      />
    </form>
  );
}

export default ProductForm;
