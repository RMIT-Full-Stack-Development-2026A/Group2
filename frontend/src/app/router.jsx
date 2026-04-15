import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import DashboardPage from "../modules/auth/pages/DashBoardPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "../routes/RoleRoute";
import Profile from "../modules/auth/pages/Profile";
import App from "../App";
import PremiumPage from "../modules/premium/pages/PremiumPage";
import OnlineArenaPage from "../modules/game/pages/OnlineArenaPage";
import AdminDashboardPage from "../modules/admin/pages/AdminDashboardPage";
import PlayerManagementPage from "../modules/admin/pages/PlayerManagementPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
        children: [
            {
                element: (
                    <RoleRoute allowedRoles={["player"]}>
                        <Outlet />
                    </RoleRoute>
                ),
                children: [
                    { path: "/dashboard", element: <DashboardPage /> },
                    { path: "/profile", element: <Profile /> },
                    { path: "/online", element: <OnlineArenaPage /> },
                    { path: "/premium", element: <PremiumPage /> },
                ],
            },
            {
                element: (
                    <RoleRoute allowedRoles={["admin"]}>
                        <Outlet />
                    </RoleRoute>
                ),
                children: [
                    {
                        path: "/admin/dashboard",
                        element: <AdminDashboardPage />,
                    },
                    {
                        path: "/admin/players",
                        element: <PlayerManagementPage />,
                    },
                ],
            },
        ],
    },
]);

export default router;
