import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Crown,
    Gamepad2,
    LayoutDashboard,
    LogOut,
    Trophy,
    User,
} from "lucide-react";

import { useAuth } from "../../modules/auth/hooks/useAuth";
import { getPremiumMe } from "../../modules/premium/services/premium.service";

const navClass = ({ isActive }) =>
    `nav-link rounded-3 px-3 py-2 ${isActive ? "active fw-semibold bg-light" : "text-secondary"}`;

export default function NavBar({ onNavigate, onShowAuthModal }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();
    const [isPremiumActive, setIsPremiumActive] = useState(false);
    const displayName = user?.displayName ?? user?.username ?? "player";
    const isAdmin = user?.role === "admin";
    const dashboardPath = isAdmin ? "/admin/dashboard" : "/dashboard";
    const showPremiumBadge = user?.role === "player" && isPremiumActive;

    useEffect(() => {
        if (user?.role !== "player") return undefined;

        let active = true;

        (async () => {
            try {
                const subscription = await getPremiumMe();
                if (active) setIsPremiumActive(Boolean(subscription?.isPremium));
            } catch {
                if (active) setIsPremiumActive(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [user?.role, location.pathname]);

    // Check if we're on guest dashboard (root path) and not authenticated
    const isOnGuestDashboard = location.pathname === "/" && !isAuthenticated;

    function shouldBlockNavigation(to) {
        if (typeof onNavigate !== "function") return false;
        return onNavigate(to) === true;
    }

    async function handleLogout() {
        if (shouldBlockNavigation("/logout")) return;
        await logout();
        navigate("/login", { replace: true });
    }

    function handleNavLinkClick(to) {
        return (event) => {
            // If guest tries to access protected route, show auth modal
            if (
                !isAuthenticated &&
                (to === dashboardPath ||
                    to === "/profile" ||
                    to === "/online" ||
                    to === "/premium")
            ) {
                event.preventDefault();
                if (typeof onShowAuthModal === "function") {
                    onShowAuthModal();
                }
                return;
            }

            if (shouldBlockNavigation(to)) {
                event.preventDefault();
            }
        };
    }

    return (
        <header className="border-bottom bg-white shadow-sm">
            <nav className="navbar navbar-expand-lg navbar-light py-2">
                <div className="container-fluid app-navbar-inner">
                    <span className="navbar-brand d-flex align-items-center gap-2 mb-0 fw-bold text-primary">
                        <Gamepad2
                            size={32}
                            strokeWidth={2}
                            aria-hidden
                            className="flex-shrink-0"
                        />
                        TicTacToang
                    </span>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#appMainNav"
                        aria-controls="appMainNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="appMainNav">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">
                            <li className="nav-item">
                                {isOnGuestDashboard ? (
                                    <span
                                        className="nav-link rounded-3 px-3 py-2 active fw-semibold bg-light"
                                        style={{ cursor: "default" }}
                                    >
                                        <span className="d-inline-flex align-items-center gap-2">
                                            <LayoutDashboard
                                                size={18}
                                                strokeWidth={2}
                                                aria-hidden
                                            />
                                            Dashboard
                                        </span>
                                    </span>
                                ) : (
                                    <NavLink
                                        to={dashboardPath}
                                        className={navClass}
                                        end
                                        onClick={handleNavLinkClick(
                                            dashboardPath,
                                        )}
                                    >
                                        <span className="d-inline-flex align-items-center gap-2">
                                            <LayoutDashboard
                                                size={18}
                                                strokeWidth={2}
                                                aria-hidden
                                            />
                                            Dashboard
                                        </span>
                                    </NavLink>
                                )}
                            </li>
                            {!isAdmin && (
                                <>
                                    <li className="nav-item">
                                        <NavLink
                                            to="/profile"
                                            className={navClass}
                                            onClick={handleNavLinkClick(
                                                "/profile",
                                            )}
                                        >
                                            <span className="d-inline-flex align-items-center gap-2">
                                                <User
                                                    size={18}
                                                    strokeWidth={2}
                                                    aria-hidden
                                                />
                                                Profile
                                            </span>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            to="/online"
                                            className={navClass}
                                            onClick={handleNavLinkClick(
                                                "/online",
                                            )}
                                        >
                                            <span className="d-inline-flex align-items-center gap-2">
                                                <Trophy
                                                    size={18}
                                                    strokeWidth={2}
                                                    aria-hidden
                                                />
                                                Online Arena
                                            </span>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            to="/premium"
                                            className={navClass}
                                            onClick={handleNavLinkClick(
                                                "/premium",
                                            )}
                                        >
                                            <span className="d-inline-flex align-items-center gap-2">
                                                <Crown
                                                    size={18}
                                                    strokeWidth={2}
                                                    aria-hidden
                                                />
                                                Premium
                                            </span>
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>

                        <div className="d-flex align-items-center gap-3 ms-lg-auto">
                            {!isAuthenticated && (
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => navigate("/login")}
                                >
                                    Login / Sign Up
                                </button>
                            )}
                            {isAuthenticated && (
                                <>
                                    <span
                                        className={`badge rounded-pill px-3 py-2 ${
                                            showPremiumBadge
                                                ? "text-bg-warning text-dark"
                                                : "text-bg-secondary"
                                        }`}
                                    >
                                        {showPremiumBadge ? "PREMIUM" : "FREE"}
                                    </span>
                                    <span className="text-secondary small">
                                        {displayName}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-1"
                                        onClick={handleLogout}
                                    >
                                        <LogOut
                                            size={16}
                                            strokeWidth={2}
                                            aria-hidden
                                        />
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
