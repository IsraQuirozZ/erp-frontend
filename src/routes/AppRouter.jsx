import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import DashboardLayout from "../layouts/DashboardLayout";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE ERP */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="customers" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
