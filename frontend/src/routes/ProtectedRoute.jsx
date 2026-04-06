import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../modules/auth/context/AuthContext";

// Requires login; saves return path for after login.
export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoadingAuth } = useAuth();
    const location = useLocation();

    // Wait for initial refresh attempt before deciding auth redirect.
    if (isLoadingAuth) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
