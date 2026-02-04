// Usage: Wrap your App or main component with <ToastProvider>
import React from "react";
import { ToastProvider } from "./components/ui/Toast.jsx";

const AppWithToast = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

export default AppWithToast;
