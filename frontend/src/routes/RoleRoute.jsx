import { cloneElement, isValidElement } from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";

function getHomePathByRole(role) {
    return role === "admin" ? "/admin/dashboard" : "/dashboard";
}

// Requires login + allowed role.
export default function RoleRoute({ allowedRoles, children }) {
    const { user, isAuthenticated } = useAuth();
    const parentOutletContext = useOutletContext();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const set = new Set(allowedRoles ?? []);
    if (!set.has(user?.role)) {
        return <Navigate to={getHomePathByRole(user?.role)} replace />;
    }

    if (children && isValidElement(children)) {
        return cloneElement(children, { context: parentOutletContext });
    }

    return <Outlet context={parentOutletContext} />;
}
