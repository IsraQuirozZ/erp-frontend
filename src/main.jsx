import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import AppWithToast from "./AppWithToast";

import "./styles/styles.css";
import "./styles/typography.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppWithToast>
        <App />
      </AppWithToast>
    </AuthProvider>
  </React.StrictMode>,
);
