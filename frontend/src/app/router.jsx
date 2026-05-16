  import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import DashboardPage from "../modules/auth/pages/DashBoardPage";
import PublicLayout from "../components/PublicLayout";
import AuthLayout from "../components/AuthLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "../routes/RoleRoute";
import ProfilePage from "../modules/profile/pages/ProfilePage";
import GameHistoryPage from "../modules/profile/pages/GameHistoryPage";
import EditProfilePage from "../modules/profile/pages/EditProfilePage";
import App from "../App";
import PremiumPage from "../modules/premium/pages/PremiumPage";
import OnlineArenaPage from "../modules/game/pages/OnlineArenaPage";
import LocalGameSetupPage from "../modules/game/pages/LocalGameSetupPage";
import AIGameSetupPage from "../modules/game/pages/AIGameSetupPage";
import GamePlayPage from "../modules/game/pages/GamePlayPage";
import AdminDashboardPage from "../modules/admin/pages/AdminDashboardPage";
import PlayerManagementPage from "../modules/admin/pages/PlayerManagementPage";



const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <DashboardPage />,
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
        ],
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
                    { path: "/profile", element: <ProfilePage /> },
                    { path: "/profile/history", element: <GameHistoryPage /> },
                    { path: "/profile/edit", element: <EditProfilePage /> },
                    { path: "/online", element: <OnlineArenaPage /> },
                    { path: "/game/local", element: <LocalGameSetupPage /> },
                    { path: "/game/ai", element: <AIGameSetupPage /> },
                    { path: "/game/play", element: <GamePlayPage /> },
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
