import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/globals.css";
import router from "./app/router";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import { PremiumProvider } from "./modules/premium/context/PremiumContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PremiumProvider>
        <RouterProvider router={router} />
      </PremiumProvider>
    </AuthProvider>
  </StrictMode>,
)
