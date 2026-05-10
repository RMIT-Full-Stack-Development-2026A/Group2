import { useState } from "react";

export default function useRoomTable() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    function searchRooms(rooms, query = search) {
        if (!query || !query.trim()) return rooms;

        const searchLower = query.toLowerCase();

        return rooms.filter((room) => {
            const roomId = (room.id || "").toLowerCase();

            return roomId.includes(searchLower);
        });
    }

    function filterRoomsByStatus(rooms, status = statusFilter) {
        if (!status || status === "all") return rooms;
        if (!Array.isArray(rooms)) return [];

        if (status === "active") {
            return rooms.filter(
                (r) => (r.status || "").toLowerCase() === "ongoing",
            );
        }

        if (status === "closed") {
            return rooms.filter((r) => {
                const s = (r.status || "").toLowerCase();
                return s === "finished" || s === "aborted" || s === "closed";
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
