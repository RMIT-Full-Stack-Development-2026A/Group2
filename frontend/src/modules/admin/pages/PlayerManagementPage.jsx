import React, { useEffect, useState } from "react";
import PlayerSearchBar from "../components/PlayerTable/sub-components/PlayerSearchBar";
import PlayerTable from "../components/PlayerTable/PlayerTable";
import usePlayerTable from "../hooks/usePlayerTable";
import { getAllUsers } from "../services/admin.service";

const MOCK_PLAYERS = [
    {
        id: "1",
        username: "player1",
        email: "player@example.com",
        isPremium: true,
        active: true,
        role: "player",
    },
    {
        id: "2",
        username: "alice_g",
        email: "alice@example.com",
        isPremium: false,
        active: true,
        role: "player",
    },
    {
        id: "3",
        username: "bob_pro",
        email: "bob@example.com",
        isPremium: true,
        active: true,
        role: "player",
    },
    {
        id: "4",
        username: "charlie",
        email: "charlie@example.com",
        isPremium: false,
        active: false,
        role: "player",
    },
    {
        id: "5",
        username: "dave99",
        email: "dave@example.com",
        isPremium: false,
        active: true,
        role: "player",
    },
    {
        id: "6",
        username: "eve_star",
        email: "eve@example.com",
        isPremium: true,
        active: true,
        role: "player",
    },
];

const PlayerManagementPage = () => {
    const [users, setUsers] = useState([]);

    function handlePlayerStatusUpdated(updatedPlayer) {
        setUsers((currentUsers) =>
            currentUsers.map((player) =>
                player.id === updatedPlayer.id
                    ? {
                          ...player,
                          ...updatedPlayer,
                      }
                    : player,
            ),
        );
    }

    const {
        search,
        setSearch,
        filterPlayers,
        showStatusModal,
        selectedPlayer,
        isSelectedPlayerActivating,
        isUpdatingStatus,
        isPlayerActive,
        toggleActive,
        handleCancelToggle,
        handleConfirmToggle,
        statusFeedbackModal,
        handleCloseStatusFeedbackModal,
    } = usePlayerTable({ onPlayerStatusUpdated: handlePlayerStatusUpdated });
    const filteredPlayers = filterPlayers(users);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getAllUsers();
            setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
        };
        fetchUsers();
    }, []);

    return (
        <>
            {users.length > 0 ? (
                <div className="container d-flex flex-column gap-4">
                    <h1 className="fs-3 fw-bold">Player Management</h1>

                    <div className="position-relative">
                        <PlayerSearchBar
                            search={search}
                            setSearch={setSearch}
                        />
                    </div>

                    <div className="table-responsive">
                        <PlayerTable
                            players={filteredPlayers}
                            showStatusModal={showStatusModal}
                            selectedPlayer={selectedPlayer}
                            isSelectedPlayerActivating={
                                isSelectedPlayerActivating
                            }
                            isUpdatingStatus={isUpdatingStatus}
                            isPlayerActive={isPlayerActive}
                            toggleActive={toggleActive}
                            handleCancelToggle={handleCancelToggle}
                            handleConfirmToggle={handleConfirmToggle}
                            statusFeedbackModal={statusFeedbackModal}
                            handleCloseStatusFeedbackModal={
                                handleCloseStatusFeedbackModal
                            }
                        />
                    </div>
                </div>
            ) : (
                <p>Loading players...</p>
            )}
        </>
    );
};

export default PlayerManagementPage;
