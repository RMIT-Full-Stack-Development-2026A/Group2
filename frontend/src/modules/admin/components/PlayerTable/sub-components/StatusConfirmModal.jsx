import React from "react";

const StatusConfirmModal = ({
    show,
    player,
    isActivating,
    isLoading,
    onCancel,
    onConfirm,
}) => {
    if (!show || !player) return null;

    return (
        <div>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                aria-labelledby="statusConfirmModalTitle"
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="statusConfirmModalTitle"
                            >
                                Confirm Account Status Change
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={onCancel}
                            />
                        </div>

                        <div className="modal-body">
                            <p className="mb-0">
                                Are you sure you want to{" "}
                                {isActivating ? "reactivate" : "deactivate"}{" "}
                                <strong>{player.username}</strong>'s account?
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                disabled={isLoading}
                                onClick={onCancel}
                            >
                                No, cancel
                            </button>
                            <button
                                type="button"
                                className={`btn ${isActivating ? "btn-primary" : "btn-danger"}`}
                                disabled={isLoading}
                                onClick={onConfirm}
                            >
                                {isLoading
                                    ? "Updating..."
                                    : `Yes, ${isActivating ? "reactivate" : "deactivate"}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={onCancel} />
        </div>
    );
};

export default StatusConfirmModal;
