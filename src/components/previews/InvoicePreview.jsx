import "./preview.css";
import { useEffect, useRef, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import AddBtn from "../addBtn.jsx";

function InvoicePreview({ invoice, onClose }) {
  const [closing, setClosing] = useState(false);
  const asideRef = useRef(null);

  if (!invoice) return null;

  const handleClose = () => {
    setClosing(true);
  };

  useEffect(() => {
    if (!closing) return;
    const aside = asideRef.current;
    if (!aside) return;

    const handleAnimationEnd = () => {
      onClose();
    };

    aside.addEventListener("animationend", handleAnimationEnd);
    return () => aside.removeEventListener("animationend", handleAnimationEnd);
  }, [closing, onClose]);

  const renderActions = () => {
    switch (invoice.status) {
      case "DRAFT":
        return (
          <>
            <button>Issue Invoice</button>
            <button>Cancel Invoice</button>
          </>
        );

      case "ISSUED":
        return (
          <>
            <button>Mark as Paid</button>
            <button>Cancel Invoice</button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="preview-overlay"
      onClick={(e) => {
        e.stopPropagation();
        handleClose();
      }}
    >
      <aside
        ref={asideRef}
        className={`preview${closing ? " slide-out" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview__header-info">
          <div className="order-info">
            {invoice.id_supplier_order && (
              <div>
                <strong>Order ID:</strong> {invoice.id_supplier_order}
              </div>
            )}
            <div>
              <strong>Invoice Number:</strong> {invoice.invoice_number}
            </div>

            <div>
              <strong>Invoice Date:</strong>{" "}
              {invoice.invoice_date?.split("T")[0]}
            </div>

            <div>
              <strong>Total:</strong> {invoice.total} €
            </div>

            <div className={`status status-${invoice.status.toLowerCase()}`}>
              {invoice.status}
            </div>
          </div>

          <div className="preview__header-actions">{renderActions()}</div>
        </div>

        <button className="close-btn" onClick={handleClose}>
          <IoIosCloseCircle size={50} />
        </button>
      </aside>
    </div>
  );
}

export default InvoicePreview;
