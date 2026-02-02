import { useEffect, useState } from "react";
import { getSupplierById } from "../../services/suppliers.service.js";
import { FaXmark } from "react-icons/fa6";

import LoadingOverlay from "../../components/ui/LoadingOverlay";
import "./preview.css";

function SupplierPreview({ supplierId, onClose }) {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supplierId) return;

    setSupplier(null);
    setLoading(true);

    const fetchSupplier = async () => {
      try {
        const data = await getSupplierById(supplierId);
        setSupplier(data);
      } catch (error) {
        console.error("Error loading supplier preview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  if (!supplierId) return null;

  if (loading || !supplier) {
    return <LoadingOverlay />;
  }

  return (
    <div className="preview-overlay" onClick={onClose}>
      <aside className="preview" onClick={(e) => e.stopPropagation()}>
        <header className="preview-header">
          <h2>{supplier.name}</h2>
          <FaXmark className="preview-close" onClick={onClose} />
        </header>

        <div className="preview-content">
          <p>
            <strong>Email:</strong> {supplier.email}
          </p>
          <p>
            <strong>Phone:</strong> {supplier.phone}
          </p>
          <p>
            <strong>Status:</strong> {supplier.active ? "Active" : "Inactive"}
          </p>
        </div>
      </aside>
    </div>
  );
}

export default SupplierPreview;
