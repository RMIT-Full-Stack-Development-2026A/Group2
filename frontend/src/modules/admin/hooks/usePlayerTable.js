import { useState } from "react";
import { toggleUserAccountStatus } from "../services/admin.service";

export default function usePlayerTable({ onPlayerStatusUpdated } = {}) {
    const [search, setSearch] = useState("");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [statusFeedbackModal, setStatusFeedbackModal] = useState({
        show: false,
        variant: "success",
        title: "",
        message: "",
    });

    function isPlayerActive(player) {
        return player.accountStatus === "active" || player.active === true;
    }

    function filterPlayers(players) {
        if (!search.trim()) return players;

        const filtered = players.filter((player) => {
            const searchLower = search.toLowerCase();
            const usernameLower = player.username?.toLowerCase() || "";
            const emailLower = player.email?.toLowerCase() || "";

            return (
                usernameLower.includes(searchLower) ||
                emailLower.includes(searchLower)
            );
        });

        return filtered;
    }

    function toggleActive(player) {
        setSelectedPlayer(player);
        setShowStatusModal(true);
    }

    function handleCancelToggle() {
        setShowStatusModal(false);
        setSelectedPlayer(null);
    }

    async function handleConfirmToggle() {
        if (!selectedPlayer) return;

        setIsUpdatingStatus(true);

        try {
            const result = await toggleUserAccountStatus(selectedPlayer.id);

            if (result?.user && onPlayerStatusUpdated) {
                onPlayerStatusUpdated(result.user);
            }

            setStatusFeedbackModal({
                show: true,
                variant: "success",
                title: "Account Status Updated",
                message:
                    result?.message ||
                    "The player account status has been updated successfully.",
            });
        } catch (error) {
            setStatusFeedbackModal({
                show: true,
                variant: "error",
                title: "Update Failed",
                message:
                    error?.message ||
                    "We could not update the player account status.",
            });
        } finally {
            setIsUpdatingStatus(false);
            setShowStatusModal(false);
            setSelectedPlayer(null);
        }
    }

    function handleCloseStatusFeedbackModal() {
        setStatusFeedbackModal({
            show: false,
            variant: "success",
            title: "",
            message: "",
        });
    }

    const isSelectedPlayerActivating = selectedPlayer
        ? !isPlayerActive(selectedPlayer)
        : false;

    return {
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
    };
}
