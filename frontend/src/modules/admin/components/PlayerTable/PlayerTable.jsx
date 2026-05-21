import React from "react";
import { Ban, CheckCircle } from "lucide-react";
import StatusConfirmModal from "./sub-components/StatusConfirmModal";
import StatusFeedbackModal from "./sub-components/StatusFeedbackModal";

const PlayerTable = ({
    players,
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
}) => {
    return (
        <>
            <table className="table table-sm align-middle w-100 mb-0">
                <thead>
                    <tr className="border-bottom">
                        <th className="p-3 fw-500 text-muted">Username</th>
                        <th className="p-3 fw-500 text-muted">Email</th>
                        <th className="p-3 fw-500 text-muted">Premium</th>
                        <th className="p-3 fw-500 text-muted">Status</th>
                        <th className="p-3 fw-500 text-muted">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {players.map((player) => {
                        const isActive = isPlayerActive(player);

                        return (
                            <tr key={player.id} className="border-bottom">
                                <td className="p-3 fw-500">
                                    {player.username}
                                </td>
                                <td className="p-3 text-muted">
                                    {player.email}
                                </td>
                                <td className="p-3">
                                    {player.isPremium ? (
                                        <span
                                            className="badge text-bg-warning text-dark px-2 py-2 text-nowrap"
                                            style={{
                                                minWidth: "100px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Premium
                                        </span>
                                    ) : (
                                        <span
                                            className="badge border border-secondary text-dark px-2 py-2 text-nowrap"
                                            style={{
                                                minWidth: "100px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Free
                                        </span>
                                    )}
                                </td>
                                <td className="p-3">
                                    <span
                                        className={
                                            isActive
                                                ? "badge bg-success px-2 py-2 text-nowrap"
                                                : "badge bg-danger px-2 py-2 text-nowrap"
                                        }
                                        style={{
                                            minWidth: "100px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {isActive ? "Active" : "Deactivated"}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button
                                        className={`btn btn-sm d-inline-flex align-items-center gap-2 text-nowrap ${
                                            isActive
                                                ? "btn-danger"
                                                : "btn-primary"
                                        }`}
                                        onClick={() => toggleActive(player)}
                                    >
                                        {isActive ? (
                                            <>
                                                <Ban
                                                    style={{
                                                        width: "12px",
                                                        height: "12px",
                                                    }}
                                                />{" "}
                                                <span className="d-none d-sm-inline">
                                                    Deactivate
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle
                                                    style={{
                                                        width: "12px",
                                                        height: "12px",
                                                    }}
                                                />{" "}
                                                <span className="d-none d-sm-inline">
                                                    Reactivate
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <StatusConfirmModal
                show={showStatusModal}
                player={selectedPlayer}
                isActivating={isSelectedPlayerActivating}
                isLoading={isUpdatingStatus}
                onCancel={handleCancelToggle}
                onConfirm={handleConfirmToggle}
            />

            <StatusFeedbackModal
                show={statusFeedbackModal.show}
                variant={statusFeedbackModal.variant}
                title={statusFeedbackModal.title}
                message={statusFeedbackModal.message}
                onClose={handleCloseStatusFeedbackModal}
            />
        </>
    );
};

export default PlayerTable;
