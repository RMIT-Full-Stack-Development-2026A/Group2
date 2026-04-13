import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import DashboardPage from "../modules/auth/pages/DashBoardPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import Profile from "../modules/auth/pages/Profile";
import App from "../App";
import PremiumPage from "../modules/premium/pages/PremiumPage";
import OnlineArenaPage from "../modules/game/pages/OnlineArenaPage";

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
      { path: "/profile", element: <Profile /> },
      { path: "/online", element: <OnlineArenaPage /> },
      { path: "/premium", element: <PremiumPage /> },
    ],
  },
]);

export default router;
