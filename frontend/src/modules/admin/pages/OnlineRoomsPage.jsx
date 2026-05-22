import React, { useState } from "react";
import RoomSearchBar from "../components/RoomTable/sub-components/RoomSearchBar";
import RoomTable from "../components/RoomTable/RoomTable";
import useRoomTable from "../hooks/useRoomTable";
import { useEffect } from "react";
import { getAllLobbies } from "../services/admin.service";

// const onlineRooms = [
//     {
//         id: "1",
//         roomNumber: "R-101",
//         player1: "Alice",
//         status: "ongoing",
//         boardSize: 10,
//         boardStyle: "classic",
//     },
//     {
//         id: "2",
//         roomNumber: "R-102",
//         player1: "Bob",
//         player2: "Charlie",
//         status: "ongoing",
//         boardSize: 10,
//         boardStyle: "wood",
//         startTime: "2025-03-25T14:00:00Z",
//     },
//     {
//         id: "3",
//         roomNumber: "R-103",
//         player1: "Dave",
//         status: "aborted",
//         boardSize: 15,
//         boardStyle: "dark",
//     },
//     {
//         id: "4",
//         roomNumber: "R-104",
//         player1: "Eve",
//         player2: "Frank",
//         status: "finished",
//         boardSize: 10,
//         boardStyle: "classic",
//         startTime: "2025-03-25T13:00:00Z",
//         endTime: "2025-03-25T13:30:00Z",
//     },
//     {
//         id: "5",
//         roomNumber: "R-105",
//         player1: "Grace",
//         player2: "Hank",
//         status: "aborted",
//         boardSize: 10,
//         boardStyle: "classic",
//         startTime: "2025-03-25T12:00:00Z",
//         endTime: "2025-03-25T12:15:00Z",
//     },
// ];

const OnlineRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const {
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        getFilteredRooms,
    } = useRoomTable();

    const safeRooms = Array.isArray(rooms) ? rooms : [];
    const filtered = getFilteredRooms(safeRooms);

    useEffect(() => {
        async function fetchLobbies() {
            try {
                const lobbies = await getAllLobbies();
                setRooms(Array.isArray(lobbies) ? lobbies : []);
            } catch (err) {
                // keep rooms as empty array on error
                setRooms([]);
                // eslint-disable-next-line no-console
                console.error("Failed to fetch lobbies:", err?.message || err);
            }
        }

        fetchLobbies();
    }, []);

    return (
        <>
            {Array.isArray(rooms) && rooms.length > 0 ? (
                <div className="container d-flex flex-column gap-4">
                    <h1 className="fs-3 fw-bold">Room Management</h1>

                    <div className="position-relative">
                        <RoomSearchBar
                            search={search}
                            setSearch={setSearch}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                        />
                    </div>

                    <div className="table-responsive">
                        <RoomTable filtered={filtered} setRooms={setRooms} />
                    </div>
                </div>
            ) : (
                <div>Loading data</div>
            )}
        </>
    );
};

export default OnlineRoomsPage;
