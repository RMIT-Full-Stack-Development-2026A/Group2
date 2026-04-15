import { Link } from "react-router-dom";
import { Users, Crown, Wifi, WifiOff, Gamepad2 } from "lucide-react";

const stats = [
    { label: "Total Players", value: 1247, icon: Users, color: "text-primary" },
    { label: "Premium Players", value: 89, icon: Crown, color: "text-warning" },
    { label: "Active Players", value: 342, icon: Wifi, color: "text-success" },
    { label: "Deactivated", value: 15, icon: WifiOff, color: "text-danger" },
    { label: "Online Rooms", value: 23, icon: Gamepad2, color: "text-info" },
];

export default function AdminDashboardPage() {
    return (
        <div className="container py-4" style={{ maxWidth: "960px" }}>
            <h1 className="h3 fw-bold mb-4">Admin Dashboard</h1>

            <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-5 g-3 mb-4">
                {stats.map((s) => (
                    <div className="col" key={s.label}>
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center py-4">
                                <s.icon
                                    size={32}
                                    className={`d-block mx-auto mb-2 ${s.color}`}
                                />
                                <p className="fs-2 fw-bold mb-1">{s.value}</p>
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
                                    View, search, and manage player accounts
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
    );
}
