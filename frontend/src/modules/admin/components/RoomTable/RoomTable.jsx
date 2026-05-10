import React from "react";
import { XCircle } from "lucide-react";

const RoomTable = ({ filtered, statusColor, closeRoom }) => {
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "ongoing":
                return "badge bg-success px-2 py-2 text-white";
            case "aborted":
                return "badge bg-danger px-2 py-2 text-white";
            case "finished":
                return "badge bg-warning px-2 py-2 text-dark";
            case "closed":
                return "badge bg-secondary px-2 py-2 text-dark";
            default:
                return "badge bg-secondary px-2 py-2 text-dark";
        }
    };

    return (
        <>
            <table className="w-100 small">
                <thead>
                    <tr className="border-bottom">
                        <th className="p-3 fw-500 text-muted">Room #</th>
                        <th className="p-3 fw-500 text-muted">Player 1</th>
                        <th className="p-3 fw-500 text-muted">Player 2</th>
                        <th className="p-3 fw-500 text-muted d-none d-sm-table-cell">
                            Start
                        </th>
                        <th className="p-3 fw-500 text-muted d-none d-sm-table-cell">
                            End
                        </th>
                        <th className="p-3 fw-500 text-muted">Status</th>
                        <th className="p-3 fw-500 text-muted">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.map((r) => (
                        <tr key={r.id} className="border-bottom">
                            <td className="p-3 fw-500">{r.roomNumber}</td>
                            <td className="p-3">{r.player1}</td>
                            <td className="p-3">{r.player2 || "—"}</td>
                            <td className="p-3 text-muted d-none d-sm-table-cell">
                                {r.startTime
                                    ? new Date(r.startTime).toLocaleTimeString()
                                    : "—"}
                            </td>
                            <td className="p-3 text-muted d-none d-sm-table-cell">
                                {r.endTime
                                    ? new Date(r.endTime).toLocaleTimeString()
                                    : "—"}
                            </td>
                            <td className="p-3">
                                <span
                                    className={getStatusBadgeClass(r.status)}
                                    style={{
                                        minWidth: "100px",
                                        textAlign: "center",
                                    }}
                                >
                                    {r.status}
                                </span>
                            </td>
                            <td className="p-3">
                                {r.status !== "closed" &&
                                    r.status !== "finished" && (
                                        <button
                                            className={`btn btn-sm d-flex align-items-center gap-2 btn-danger`}
                                            onClick={() => closeRoom(r.id)}
                                        >
                                            <XCircle
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                }}
                                            />{" "}
                                            Close
                                        </button>
                                    )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default RoomTable;
