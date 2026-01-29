import "./customerForm.css";

function CustomerForm({ onClose }) {
  return (
    <form className="customer-form">
      {/* ───────────── CLIENT INFO ───────────── */}
      <section className="form-section">
        <h3>Customer information</h3>

        <div className="form-grid">
          <div className="form-field">
            <label>First name</label>
            <input type="text" placeholder="John" />
          </div>

          <div className="form-field">
            <label>Last name</label>
            <input type="text" placeholder="Doe" />
          </div>

          <div className="form-field">
            <label>Email</label>
            <input type="email" placeholder="john@company.com" />
          </div>

          <div className="form-field">
            <label>Phone</label>
            <input type="text" placeholder="+34 600 000 000" />
          </div>
        </div>
      </section>

      {/* ───────────── ADDRESS ───────────── */}
      <section className="form-section">
        <h3>Address</h3>

        <div className="form-grid">
          <div className="form-field">
            <label>Province</label>
            <select>
              <option value="">Select province</option>
              <option>Madrid</option>
              <option>Barcelona</option>
              <option>Valencia</option>
            </select>
          </div>

          <div className="form-field">
            <label>Postal code</label>
            <input type="text" placeholder="28001" />
          </div>

          <div className="form-field form-span-2">
            <label>Street</label>
            <input type="text" placeholder="Main street" />
          </div>

          <div className="form-field">
            <label>Number</label>
            <input type="text" placeholder="12" />
          </div>
        </div>
      </section>

      {/* ───────────── ACTIONS ───────────── */}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>

        <button type="submit" className="btn-primary">
          Save customer
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
