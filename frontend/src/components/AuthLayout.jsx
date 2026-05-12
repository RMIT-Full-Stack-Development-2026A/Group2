import { Outlet } from "react-router-dom";

/**
 * Auth layout for login/register pages
 * No navbar, just the form content
 */
export default function AuthLayout() {
  return (
    <div className="app-shell min-vh-100 d-flex flex-column bg-light">
      <main className="flex-grow-1 w-100">
        <Outlet />
      </main>
    </div>
  );
}
