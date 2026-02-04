import { createContext, useContext, useState, useCallback } from "react";
import "./toast.css";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    visible: false,
    type: "info",
  });

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="toast-icon toast-success-icon" />;
      case "error":
        return <FaTimesCircle className="toast-icon toast-error-icon" />;
      case "warning":
        return (
          <FaExclamationTriangle className="toast-icon toast-warning-icon" />
        );
      default:
        return <FaInfoCircle className="toast-icon toast-info-icon" />;
    }
  };

  const detectTypeFromError = (error) => {
    if (!error) return "info";
    if (error?.response?.status >= 500) return "error";
    if (error?.response?.status === 409 || error?.response?.status === 400)
      return "warning";
    if (error?.response?.status === 200) return "success";
    return "info";
  };

  const getMessageFromError = (error) => {
    if (!error) return "Unknown error";
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Unknown error"
    );
  };

  // Accepts either (message, type, duration) or (error, duration)
  const showToast = useCallback((input, type = undefined, duration = 3000) => {
    let message = "";
    let toastType = type;
    if (typeof input === "object" && input !== null) {
      message = getMessageFromError(input);
      toastType = type || detectTypeFromError(input);
    } else {
      message = input;
      toastType = type || "info";
    }
    setToast({ message, visible: true, type: toastType });
    setTimeout(
      () => setToast({ message: "", visible: false, type: "info" }),
      duration,
    );
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div className={`toast toast-${toast.type}`}>
          {getIcon(toast.type)}
          <span className="toast-message">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};
