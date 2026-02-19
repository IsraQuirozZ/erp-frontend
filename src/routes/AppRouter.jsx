import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import RequireRole from "../auth/RequireRole";

import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateUser from "../pages/CreateUser";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Sales from "../pages/Sales";
import Suppliers from "../pages/Suppliers";
import Purchases from "../pages/Purchases";
import Inventory from "../pages/Inventory";
import Products from "../pages/Products";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE ERP */}
        <Route element={<RequireAuth />}>
          <Route path="/app" element={<DashboardLayout />}>
            {/* DEFAULT */}
            <Route index element={<Navigate to="dashboard" />} />

            {/* ALL USERS */}
            <Route
              path="dashboard"
              element={
                <RequireRole allowedRoles={["ADMIN", "USER"]}>
                  <Dashboard />
                </RequireRole>
              }
            />

            {/* ADMIN */}
            <Route
              path="users/create"
              element={
                <RequireRole allowedRoles={["ADMIN"]}>
                  <CreateUser />
                </RequireRole>
              }
            />

            <Route
              path="customers"
              element={
                <RequireRole allowedRoles={["ADMIN"]}>
                  <Customers />
                </RequireRole>
              }
            />

            <Route
              path="sales"
              element={
                <RequireRole allowedRoles={["ADMIN"]}>
                  <Sales />
                </RequireRole>
              }
            />

            <Route
              path="suppliers"
              element={
                <RequireRole allowedRoles={["ADMIN"]}>
                  <Suppliers />
                </RequireRole>
              }
            />
            <Route
              path="purchases"
              element={
                <RequireRole allowedRoles={["ADMIN"]}>
                  <Purchases />
                </RequireRole>
              }
            />
            <Route
              path="inventory"
              element={
                <RequireRole allowedRoles={["ADMIN"]}>
                  <Inventory />
                </RequireRole>
              }
            />
            <Route
              path="products"
              element={
                <RequireRole allowedRoles={["ADMIN"]}>
                  <Products />
                </RequireRole>
              }
            />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/app/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
