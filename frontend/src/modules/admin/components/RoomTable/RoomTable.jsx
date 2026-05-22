import React from "react";
import { XCircle } from "lucide-react";
import { closeLobby } from "../../services/admin.service";

const RoomTable = ({ filtered, setRooms }) => {
    async function closeRoom(lobbyId) {
        const closedLobby = await closeLobby(lobbyId);

        setRooms((currentRooms) =>
            currentRooms.map((room) =>
                room.lobbyId === lobbyId
                    ? {
                          ...room,
                          ...closedLobby,
                      }
                    : room,
            ),
        );
    }

    const formatDateTime = (value) => {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}, ${hours}:${minutes}`;
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "active":
                return "badge bg-success px-2 py-2 text-white";
            case "closed":
                return "badge bg-danger px-2 py-2 text-white";
            case "finished":
                return "badge bg-warning px-2 py-2 text-dark";
            case "waiting":
                return "badge bg-primary px-2 py-2 text-white";
        }
    };

    return (
        <>
            <table className="table table-sm align-middle w-100 mb-0">
                <thead>
                    <tr className="border-bottom">
                        <th className="p-3 fw-500 text-muted">Room #</th>
                        <th className="p-3 fw-500 text-muted">Player 1</th>
                        <th className="p-3 fw-500 text-muted">Player 2</th>
                        <th className="p-3 fw-500 text-muted">Start</th>
                        <th className="p-3 fw-500 text-muted">End</th>
                        <th className="p-3 fw-500 text-muted">Status</th>
                        <th className="p-3 fw-500 text-muted">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {(Array.isArray(filtered) ? filtered : []).map((r) => (
                        <tr key={r.id} className="border-bottom">
                            <td className="p-3 fw-500">{r.roomNumber}</td>
                            <td className="p-3">{r.players?.[0] || "—"}</td>
                            <td className="p-3">
                                {r.players?.length === 2 ? r.players[1] : "—"}
                            </td>
                            <td className="p-3 text-muted">
                                {formatDateTime(r.startTime)}
                            </td>
                            <td className="p-3 text-muted">
                                {formatDateTime(r.endTime)}
                            </td>
                            <td className="p-3">
                                <span
                                    className={`${getStatusBadgeClass(r.status)} text-nowrap`}
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
                                            className={`btn btn-sm d-inline-flex align-items-center gap-2 btn-danger text-nowrap`}
                                            onClick={() => closeRoom(r.lobbyId)}
                                        >
                                            <XCircle
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                }}
                                            />{" "}
                                            <span className="d-none d-sm-inline">
                                                Close
                                            </span>
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
