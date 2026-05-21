import { Link } from "react-router-dom";
import { Users, Crown, Wifi, WifiOff, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { getSystemStats } from "../services/admin.service";
import socket from "../../../lib/socket";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState([]);
    const [roomCounts, setRoomCounts] = useState({ waiting: 0, active: 0 });

    useEffect(() => {
        async function fetchStats() {
            const fetchedStats = await getSystemStats();
            setRoomCounts({
                waiting: fetchedStats.onlineRoomsWaiting || 0,
                active: fetchedStats.onlineRoomsActive || 0,
            });

            setStats([
                {
                    label: "Total Players",
                    value: fetchedStats.totalUsers,
                    icon: Users,
                    color: "text-primary",
                },
                {
                    label: "Premium Players",
                    value: fetchedStats.premiumUsers,
                    icon: Crown,
                    color: "text-warning",
                },
                {
                    label: "Active Players",
                    value: fetchedStats.activeUsers,
                    icon: Wifi,
                    color: "text-success",
                },
                {
                    label: "Deactivated",
                    value: fetchedStats.deactivatedUsers,
                    icon: WifiOff,
                    color: "text-danger",
                },
                {
                    label: "Active Rooms",
                    value: fetchedStats.onlineRoomsActive || 0,
                    icon: Gamepad2,
                    color: "text-info",
                },
                {
                    label: "Waiting Rooms",
                    value: fetchedStats.onlineRoomsWaiting || 0,
                    icon: Gamepad2,
                    color: "text-muted",
                },
            ]);
        }
        fetchStats();
    }, []);

    useEffect(() => {
        // ensure socket connected and listen for room count updates
        if (!socket.connected) socket.connect();

        function handleCounts(counts) {
            setRoomCounts(counts || { waiting: 0, active: 0 });
            setStats((current) =>
                current.map((s) => {
                    if (s.label === "Active Rooms")
                        return { ...s, value: counts.active };
                    if (s.label === "Waiting Rooms")
                        return { ...s, value: counts.waiting };
                    return s;
                }),
            );
        }

        socket.on("roomCountsUpdated", handleCounts);

        return () => {
            socket.off("roomCountsUpdated", handleCounts);
        };
    }, []);
    return (
        <>
            {stats.length > 0 ? (
                <div className="container py-4" style={{ maxWidth: "960px" }}>
                    <h1 className="h3 fw-bold mb-4">Admin Dashboard</h1>

                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 mb-4">
                        {stats.map((s) => (
                            <div className="col" key={s.label}>
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center py-4">
                                        <s.icon
                                            size={32}
                                            className={`d-block mx-auto mb-2 ${s.color}`}
                                        />
                                        <p className="fs-2 fw-bold mb-1">
                                            {s.value}
                                        </p>
                                        <p className="small text-secondary mb-0">
                                            {s.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row row-cols-1 row-cols-sm-2 g-3">
                        <div className="col">
                            <Link
                                to="/admin/players"
                                className="text-decoration-none text-reset d-block h-100"
                            >
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h2 className="h5 d-flex align-items-center gap-2 mb-2">
                                            <Users size={20} /> Manage Players
                                        </h2>
                                        <p className="small text-secondary mb-0">
                                            View, search, and manage player
                                            accounts
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="col">
                            <Link
                                to="/admin/rooms"
                                className="text-decoration-none text-reset d-block h-100"
                            >
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h2 className="h5 d-flex align-items-center gap-2 mb-2">
                                            <Gamepad2 size={20} /> Manage Rooms
                                        </h2>
                                        <p className="small text-secondary mb-0">
                                            Monitor and manage online game rooms
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading statistics...</p>
            )}
        </>
    );
}
