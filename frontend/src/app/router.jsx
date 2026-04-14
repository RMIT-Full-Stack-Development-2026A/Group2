import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import DashboardPage from "../modules/auth/pages/DashBoardPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import ProfilePage from "../modules/profile/pages/ProfilePage";
import EditProfilePage from "../modules/profile/pages/EditProfilePage";
import App from "../App";
import PremiumPage from "../modules/premium/pages/PremiumPage";
import OnlineArenaPage from "../modules/game/pages/OnlineArenaPage";
import LocalGameSetupPage from "../modules/game/pages/LocalGameSetupPage";
import AIGameSetupPage from "../modules/game/pages/AIGameSetupPage";
import GamePlayPage from "../modules/game/pages/GamePlayPage";

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
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/profile/edit", element: <EditProfilePage /> },
      { path: "/online", element: <OnlineArenaPage /> },
      { path: "/onlinearena", element: <OnlineArenaPage /> },
      { path: "/game/local", element: <LocalGameSetupPage /> },
      { path: "/game/ai", element: <AIGameSetupPage /> },
      { path: "/game/play", element: <GamePlayPage /> },
      { path: "/premium", element: <PremiumPage /> },
    ],
  },
]);

export default router;
