import { createBrowserRouter, Outlet } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import DashboardPage from "../modules/auth/pages/DashBoardPage";
import PublicLayout from "../components/PublicLayout";
import AuthLayout from "../components/AuthLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "../routes/RoleRoute";
import ProfilePage from "../modules/profile/pages/ProfilePage";
import GameHistoryPage from "../modules/profile/pages/GameHistoryPage";
import MatchReplayPage from "../modules/profile/pages/MatchReplayPage";
import EditProfilePage from "../modules/profile/pages/EditProfilePage";
import App from "../App";
import PremiumPage from "../modules/premium/pages/PremiumPage";
import PremiumSuccessPage from "../modules/premium/pages/PremiumSuccessPage";
import PremiumCancelPage from "../modules/premium/pages/PremiumCancelPage";
import OnlineArenaPage from "../modules/game/pages/OnlineArenaPage";
import LocalGameSetupPage from "../modules/game/pages/LocalGameSetupPage";
import AIGameSetupPage from "../modules/game/pages/AIGameSetupPage";
import GamePlayPage from "../modules/game/pages/GamePlayPage";
import AdminDashboardPage from "../modules/admin/pages/AdminDashboardPage";
import PlayerManagementPage from "../modules/admin/pages/PlayerManagementPage";
import OnlineRoomsPage from "../modules/admin/pages/OnlineRoomsPage";
import SpectatorMatchPage from "../modules/game/pages/SpectatorMatchPage";

const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <DashboardPage />,
            },
            {
                path: "/watch/:token",
                element: <SpectatorMatchPage />,
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
                    {
                        path: "/profile/history/replay/:sessionId",
                        element: <MatchReplayPage />,
                    },
                    { path: "/online", element: <OnlineArenaPage /> },
                    { path: "/game/local", element: <LocalGameSetupPage /> },
                    { path: "/game/ai", element: <AIGameSetupPage /> },
                    { path: "/game/play", element: <GamePlayPage /> },
                    { path: "/premium", element: <PremiumPage /> },
                    { path: "/premium/success", element: <PremiumSuccessPage /> },
                    { path: "/premium/cancel", element: <PremiumCancelPage /> },
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
                    {
                        path: "/admin/rooms",
                        element: <OnlineRoomsPage />,
                    },
                ],
            },
        ],
    },
]);

export default router;
