import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";

// Requires login; saves return path for after login.
export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoadingAuth } = useAuth();
    const location = useLocation();

    if (!isAuthenticated && isLoadingAuth) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
