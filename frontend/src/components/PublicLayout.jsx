import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import AuthRequiredModal from "./Modals/AuthRequiredModal";

/**
 * Public layout for unauthenticated routes (guest dashboard, login, etc.)
 * Includes NavBar with login/signup button and auth modal for guest access
 */
export default function PublicLayout() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <div className="app-shell min-vh-100 d-flex flex-column bg-light">
        <NavBar onShowAuthModal={() => setShowAuthModal(true)} />
        <main className="flex-grow-1 w-100">
          <div className="container app-page py-4 py-lg-5">
            <Outlet context={{ showAuthModal, setShowAuthModal }} />
          </div>
        </main>
      </div>
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
