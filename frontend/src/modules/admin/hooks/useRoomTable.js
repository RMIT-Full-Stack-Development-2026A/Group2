import { useState } from "react";

export default function useRoomTable() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    function searchRooms(rooms, query = search) {
        if (!query || !query.trim()) return rooms;

        const searchLower = query.toLowerCase();

        return rooms.filter((room) => {
                const roomNum = (room.roomNumber || "").toLowerCase();
                const players = Array.isArray(room.players) ? room.players : [];
                const player1 = (players[0] || "").toLowerCase();
                const player2 = players.length === 2 ? (players[1] || "").toLowerCase() : "";

            return (
                roomNum.includes(searchLower) ||
                player1.includes(searchLower) ||
                player2.includes(searchLower)
            );
        });
    }

    function filterRoomsByStatus(rooms, status = statusFilter) {
        if (!status || status === "all") return rooms;
        if (!Array.isArray(rooms)) return [];

        if (status === "active") {
            return rooms.filter((r) => {
                const s = (r.status || "").toLowerCase();
                return s === "active" || s === "waiting";
            });
        }

        if (status === "closed") {
            return rooms.filter((r) => {
                const s = (r.status || "").toLowerCase();
                return s === "finished" || s === "closed";
            });
        }

        return rooms;
    }

    function getFilteredRooms(rooms) {
        if (!Array.isArray(rooms)) return [];
        const byStatus = filterRoomsByStatus(rooms, statusFilter);
        return searchRooms(byStatus, search);
    }

    return {
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        searchRooms,
        filterRoomsByStatus,
        getFilteredRooms,
    };
}
