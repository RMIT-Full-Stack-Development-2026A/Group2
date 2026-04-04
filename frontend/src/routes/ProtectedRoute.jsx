import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../modules/auth/context/AuthContext";

// Requires login; saves return path for after login.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
