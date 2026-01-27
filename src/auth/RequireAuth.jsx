import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RequireAuth() {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
