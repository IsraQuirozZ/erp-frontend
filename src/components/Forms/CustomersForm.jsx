import "./customerForm.css";
import { useState } from "react";
import api from "../../api/axios";
import SuccessPopup from "../Modals/SuccessPopup.jsx";

function CustomerForm({ onClose }) {
  // FRONT ERRORS
  const [errors, setErrors] = useState({});

  // BACK ERRORS & SUCCESS
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    client: {
      firstName: "",
      lastName: "",
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
  });

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

    // ───── CLIENT ─────
    if (!form.client.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (form.client.firstName.trim().length < 3) {
      newErrors.firstName = "First name must be at least 3 characters";
    } else if (
      !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(form.client.firstName.trim())
    ) {
      newErrors.firstName = "First name can only contain letters";
    }

    if (!form.client.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (form.client.lastName.trim().length < 3) {
      newErrors.lastName = "Last name must be at least 3 characters";
    } else if (
      !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(form.client.lastName.trim())
    ) {
      newErrors.lastName = "Last name can only contain letters";
    }

    if (!form.client.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    if (!form.client.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\+?\d{9,12}$/.test(form.client.phone.trim())) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) return;

    try {
      const response = await api.post("/clients/full", form);
      console.log("PAYLOAD FINAL", response);
      setSuccess(true);

      setForm({
        client: {
          firstName: "",
          lastName: "",
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
      });
    } catch (error) {
      if (error.response?.data?.error) {
        console.log("error");
        setError(error.response.data.error);
      } else {
        setError("Unexpected error");
      }
    }
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      {/* ───────────── CLIENT INFO ───────────── */}
      <section className="form-section">
        <h3>Customer information</h3>

        <div className="form-grid">
          <div className="form-field">
            <label>First name</label>
            <input
              type="text"
              placeholder="John"
              value={form.client.firstName}
              onChange={(e) =>
                updateForm("client", "firstName", e.target.value)
              }
              className={errors.firstName ? "input-error" : ""}
            />
            {errors.firstName && (
              <small className="form-field-error">{errors.firstName}</small>
            )}
          </div>

          <div className="form-field">
            <label>Last name</label>
            <input
              type="text"
              placeholder="Doe"
              value={form.client.lastName}
              className={errors.lastName ? "input-error" : ""}
              onChange={(e) => updateForm("client", "lastName", e.target.value)}
            />
            {errors.lastName && (
              <small className="form-field-error">{errors.lastName}</small>
            )}
          </div>

          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="john@company.com"
              value={form.client.email}
              className={errors.email ? "input-error" : ""}
              onChange={(e) => updateForm("client", "email", e.target.value)}
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
              value={form.client.phone}
              className={errors.phone ? "input-error" : ""}
              onChange={(e) => updateForm("client", "phone", e.target.value)}
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
            Save customer
          </button>
        </div>
      </div>

      <SuccessPopup
        open={success}
        title="Customer created"
        message="The customer has been successfully created."
        onClose={() => {
          setSuccess(false);
          onClose(); // cerrar el modal principal
        }}
      />
    </form>
  );
}

export default CustomerForm;
