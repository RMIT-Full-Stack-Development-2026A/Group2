import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";

function getHomePathByRole(role) {
    return role === "admin" ? "/admin/dashboard" : "/dashboard";
}

// Requires login + allowed role.
export default function RoleRoute({ allowedRoles, children }) {
    const { user, isAuthenticated } = useAuth();
    const outletContext = useOutletContext();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const set = new Set(allowedRoles ?? []);
    if (!set.has(user?.role)) {
        return <Navigate to={getHomePathByRole(user?.role)} replace />;
    }

    return <Outlet context={outletContext} />;
}
