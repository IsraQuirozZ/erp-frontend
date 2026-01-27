import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RequireRole({ allowedRoles, children }) {
  const { auth } = useAuth();

  if (!auth?.user?.roles) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = auth.user.roles.some((role) => allowedRoles.includes(role));

  if (!hasRole) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
}

export default RequireRole;
