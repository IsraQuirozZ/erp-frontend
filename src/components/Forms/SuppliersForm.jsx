import "./customerForm.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import SuccessPopup from "../Modals/SuccessPopup.jsx";

const emptyForm = {
  supplier: {
    name: "",
    email: "",
    phone: "",
  },
  address: {
    postal_code: "",
    street: "",
    municipality: "",
    number: "",
    portal: "",
    floor: "",
    door: "",
  },
  province: { name: "" },
};

function SupplierForm({
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
        supplier: {
          name: initialData.name ?? "",
          email: initialData.email ?? "",
          phone: initialData.phone ?? "",
        },
        address: {
          postal_code: initialData.address?.postal_code ?? "",
          street: initialData.address?.street ?? "",
          municipality: initialData.address?.municipality ?? "",
          number: initialData.address?.number ?? "",
          portal: initialData.address?.portal ?? "",
          floor: initialData.address?.floor ?? "",
          door: initialData.address?.door ?? "",
        },
        province: {
          name: initialData.address?.province?.name ?? "",
        },
      });
    }
  }, [mode, initialData]);

  const updateForm = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // VALIDATIONS
  const validateForm = () => {
    const newErrors = {};

    // ───── SUPPLIER ─────
    if (!form.supplier.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.supplier.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(form.supplier.name.trim())) {
      newErrors.name = "Name can only contain letters";
    }

    if (!form.supplier.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.supplier.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    if (!form.supplier.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\+?\d{9,12}$/.test(form.supplier.phone.trim())) {
      newErrors.phone = "Phone must be between 9 and 12 digits";
    }

    // ───── PROVINCE ─────
    if (!form.province.name.trim()) {
      newErrors.province = "Province is required";
    } else if (form.province.name.trim().length < 3) {
      newErrors.province = "Province must be at least 3 characters";
    } else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(form.province.name.trim())) {
      newErrors.province = "Province can only contain letters";
    }

    // ───── ADDRESS ─────
    if (!form.address.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required";
    } else if (!/^[0-9]{5}$/.test(form.address.postal_code.trim())) {
      newErrors.postal_code = "Postal code must have 5 digits";
    }

    if (!form.address.street.trim()) {
      newErrors.street = "Street is required";
    } else if (form.address.street.trim().length < 3) {
      newErrors.street = "Street must be at least 3 characters";
    } else if (
      !/^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(form.address.street.trim())
    ) {
      newErrors.street = "Street can only contain letters and numbers";
    }

    if (!form.address.municipality.trim()) {
      newErrors.municipality = "Municipality is required";
    } else if (form.address.municipality.trim().length < 3) {
      newErrors.municipality = "Municipality must be at least 3 characters";
    } else if (
      !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(form.address.municipality.trim())
    ) {
      newErrors.municipality = "Municipality can only contain letters";
    }

    if (!form.address.number.trim()) {
      newErrors.number = "Street number is required";
    } else if (!/^[0-9]+$/.test(form.address.number.trim())) {
      newErrors.number = "Street number can only contain numbers";
    }

    if (form.address.portal) {
      if (form.address.portal.trim().length < 1) {
        newErrors.portal = "Portal must be at least 1 character";
      } else if (!/^[A-Za-z0-9]+$/.test(form.address.portal.trim())) {
        newErrors.portal = "Portal can only contain letters and numbers";
      }
    }

    if (form.address.floor) {
      if (form.address.floor.trim().length < 1) {
        newErrors.floor = "Floor must be at least 1 character";
      } else if (!/^[A-Za-z0-9]+$/.test(form.address.floor.trim())) {
        newErrors.floor = "Floor can only contain letters and numbers";
      }
    }

    if (form.address.door) {
      if (form.address.door.trim().length < 1) {
        newErrors.door = "Door must be at least 1 character";
      } else if (!/^[A-Za-z0-9]+$/.test(form.address.door.trim())) {
        newErrors.door = "Door can only contain letters and numbers";
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
        await api.post("/suppliers/full", form);
      } else {
        await api.put(`/suppliers/full/${initialData.id_supplier}`, form);
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
        <h3>Supplier information</h3>

        <div className="form-grid">
          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              placeholder="John"
              value={form.supplier.name}
              onChange={(e) => updateForm("supplier", "name", e.target.value)}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && (
              <small className="form-field-error">{errors.name}</small>
            )}
          </div>

          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="john@company.com"
              value={form.supplier.email}
              className={errors.email ? "input-error" : ""}
              onChange={(e) => updateForm("supplier", "email", e.target.value)}
            />
            {errors.email && (
              <small className="form-field-error">{errors.email}</small>
            )}
          </div>

          <div className="form-field">
            <label>Phone</label>
            <input
              type="text"
              placeholder="+34 600 000 000"
              value={form.supplier.phone}
              className={errors.phone ? "input-error" : ""}
              onChange={(e) => updateForm("supplier", "phone", e.target.value)}
            />
            {errors.phone && (
              <small className="form-field-error">{errors.phone}</small>
            )}
          </div>
        </div>
      </section>

      {/* ───────────── ADDRESS ───────────── */}
      <section className="form-section">
        <h3>Address</h3>

        <div className="form-grid">
          <div className="form-field">
            <label>Province</label>
            <input
              type="text"
              placeholder="Madrid"
              value={form.province.name}
              className={errors.province ? "input-error" : ""}
              onChange={(e) => updateForm("province", "name", e.target.value)}
            />
            {errors.province && (
              <small className="form-field-error">{errors.province}</small>
            )}
          </div>

          <div className="form-field">
            <label>Postal code</label>
            <input
              type="text"
              placeholder="28001"
              value={form.address.postal_code}
              className={errors.postal_code ? "input-error" : ""}
              onChange={(e) =>
                updateForm("address", "postal_code", e.target.value)
              }
            />
            {errors.postal_code && (
              <small className="form-field-error">{errors.postal_code}</small>
            )}
          </div>

          <div className="form-field">
            <label>Street</label>
            <input
              type="text"
              placeholder="Main street"
              value={form.address.street}
              className={errors.street ? "input-error" : ""}
              onChange={(e) => updateForm("address", "street", e.target.value)}
            />
            {errors.street && (
              <small className="form-field-error">{errors.street}</small>
            )}
          </div>

          <div className="form-field">
            <label>Number</label>
            <input
              type="text"
              placeholder="12"
              value={form.address.number}
              className={errors.number ? "input-error" : ""}
              onChange={(e) => updateForm("address", "number", e.target.value)}
            />
            {errors.number && (
              <small className="form-field-error">{errors.number}</small>
            )}
          </div>

          <div className="form-field">
            <label>Municipality</label>
            <input
              type="text"
              placeholder="S.S de los Reyes"
              value={form.address.municipality}
              className={errors.municipality ? "input-error" : ""}
              onChange={(e) =>
                updateForm("address", "municipality", e.target.value)
              }
            />
            {errors.municipality && (
              <small className="form-field-error">{errors.municipality}</small>
            )}
          </div>

          <div className="form-field">
            <label>Portal</label>
            <input
              type="text"
              placeholder="Portal"
              value={form.address.portal}
              className={errors.portal ? "input-error" : ""}
              onChange={(e) => updateForm("address", "portal", e.target.value)}
            />
            {errors.portal && (
              <small className="form-field-error">{errors.portal}</small>
            )}
          </div>

          <div className="form-field">
            <label>Floor</label>
            <input
              type="text"
              placeholder="2"
              value={form.address.floor}
              className={errors.floor ? "input-error" : ""}
              onChange={(e) => updateForm("address", "floor", e.target.value)}
            />
            {errors.floor && (
              <small className="form-field-error">{errors.floor}</small>
            )}
          </div>

          <div className="form-field">
            <label>Door</label>
            <input
              type="text"
              placeholder="G"
              value={form.address.door}
              className={errors.door ? "input-error" : ""}
              onChange={(e) => updateForm("address", "door", e.target.value)}
            />
            {errors.door && (
              <small className="form-field-error">{errors.door}</small>
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
            {mode === "create" ? "Create Supplier" : "Update Supplier"}
          </button>
        </div>
      </div>

      {/* ───────────── POPUP ───────────── */}
      <SuccessPopup
        open={success}
        title={mode === "create" ? "Supplier Created" : "Supplier Updated"}
        message={
          mode === "create"
            ? "The supplier has been successfully created."
            : "The supplier has been successfully updated."
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

export default SupplierForm;
