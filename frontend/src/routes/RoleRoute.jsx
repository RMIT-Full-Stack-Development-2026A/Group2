import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/context/AuthContext";

export default function RoleRoute({ allowedRoles, children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const set = new Set(allowedRoles ?? []);
  if (!set.has(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
