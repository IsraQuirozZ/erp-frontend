import "./customerForm.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import SuccessPopup from "../Modals/SuccessPopup.jsx";
import { useToast } from "../ui/Toast.jsx";

const emptyForm = {
  warehouse: {
    name: "",
    warehouse_type: "MAIN",
    capacity: "",
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

function WarehouseForm({
  mode = "create", // "create" | "edit"
  initialData = null,
  onClose,
  onSuccess,
}) {
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { showToast } = useToast();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        warehouse: {
          name: initialData.name ?? "",
          warehouse_type: initialData.warehouse_type ?? "MAIN",
          capacity: initialData.capacity ?? "",
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

  const validateForm = () => {
    const newErrors = {};
    // ───── WAREHOUSE ─────
    if (!form.warehouse.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.warehouse.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    if (!form.warehouse.capacity || isNaN(form.warehouse.capacity)) {
      newErrors.capacity = "Capacity is required and must be a number";
    } else if (parseInt(form.warehouse.capacity) <= 0) {
      newErrors.capacity = "Capacity must be greater than 0";
    }
    if (!form.warehouse.warehouse_type.trim()) {
      newErrors.warehouse_type = "Warehouse type is required";
    } else if (
      !["MAIN", "SECONDARY", "DISTRIBUTION", "STORE"].includes(
        form.warehouse.warehouse_type.trim().toUpperCase(),
      )
    ) {
      newErrors.warehouse_type = "Invalid warehouse type";
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
      }
    }
    if (form.address.floor) {
      if (form.address.floor.trim().length < 1) {
        newErrors.floor = "Floor must be at least 1 character";
      }
    }
    if (form.address.door) {
      if (form.address.door.trim().length < 1) {
        newErrors.door = "Door must be at least 1 character";
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

    // Convert all fields to string before sending
    const formToSend = {
      warehouse: {
        ...form.warehouse,
        name: String(form.warehouse.name),
        warehouse_type: String(form.warehouse.warehouse_type),
        capacity:
          form.warehouse.capacity !== undefined
            ? String(form.warehouse.capacity)
            : "",
      },
      address: {
        ...form.address,
        postal_code: String(form.address.postal_code),
        street: String(form.address.street),
        municipality: String(form.address.municipality),
        number: String(form.address.number),
        portal:
          form.address.portal !== undefined ? String(form.address.portal) : "",
        floor:
          form.address.floor !== undefined ? String(form.address.floor) : "",
        door: form.address.door !== undefined ? String(form.address.door) : "",
      },
      province: {
        name: String(form.province.name),
      },
    };

    try {
      if (mode === "create") {
        await api.post("/warehouses", formToSend);
      } else {
        await api.put(`/warehouses/${initialData.id_warehouse}`, formToSend);
      }
      setSuccess(true);
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
        showToast(error.response.data.error, "error");
      } else {
        setError("Unexpected error");
        showToast("Unexpected error", "error");
      }
    }
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      {/* ───────────── WAREHOUSE INFO ───────────── */}
      <section className="form-section">
        <h3>Warehouse information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Central Warehouse"
              value={form.warehouse.name}
              onChange={(e) => updateForm("warehouse", "name", e.target.value)}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && (
              <small className="form-field-error">{errors.name}</small>
            )}
          </div>
          <div className="form-field">
            <label>Type</label>
            <select
              value={form.warehouse.warehouse_type}
              onChange={(e) =>
                updateForm("warehouse", "warehouse_type", e.target.value)
              }
              className={errors.warehouse_type ? "input-error" : ""}
            >
              <option value="MAIN">Main</option>
              <option value="SECONDARY">Secondary</option>
              <option value="DISTRIBUTION">Distribution</option>
              <option value="STORE">Store</option>
            </select>
            {errors.warehouse_type && (
              <small className="form-field-error">
                {errors.warehouse_type}
              </small>
            )}
          </div>
          <div className="form-field">
            <label>Capacity</label>
            <input
              type="number"
              placeholder="1000"
              value={form.warehouse.capacity}
              onChange={(e) =>
                updateForm("warehouse", "capacity", e.target.value)
              }
              className={errors.capacity ? "input-error" : ""}
            />
            {errors.capacity && (
              <small className="form-field-error">{errors.capacity}</small>
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
            {mode === "create" ? "Create Warehouse" : "Update Warehouse"}
          </button>
        </div>
      </div>
      <SuccessPopup
        open={success}
        title={mode === "create" ? "Warehouse Created" : "Warehouse Updated"}
        message={
          mode === "create"
            ? "The warehouse has been successfully created."
            : "The warehouse has been successfully updated."
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

export default WarehouseForm;
