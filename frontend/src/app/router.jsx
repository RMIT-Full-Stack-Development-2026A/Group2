import { createBrowserRouter, Navigate } from "react-router-dom";

import GamePage from "../modules/game/pages/LocalGamePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/game",
    element: <GamePage/>,
  }
  
]);

export default router;
