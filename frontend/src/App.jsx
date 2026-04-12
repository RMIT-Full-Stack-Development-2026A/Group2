import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
/**
 * Root layout for authenticated routes: nav + main column + child routes via <Outlet />.
 * Used for dashboard, profile, online arena, premium, etc. (see router.)
 */
export default function App() {
  return (
    <div className="app-shell min-vh-100 d-flex flex-column bg-light">
      <NavBar />
      <main className="flex-grow-1 w-100">
        <div className="container app-page py-4 py-lg-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
