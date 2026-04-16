import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const StatusFeedbackModal = ({ show, variant, title, message, onClose }) => {
    if (!show) return null;

    const isSuccess = variant === "success";

    return (
        <>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                aria-labelledby="statusFeedbackModalTitle"
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="d-flex align-items-center gap-2">
                                {isSuccess ? (
                                    <CheckCircle2
                                        className="text-success"
                                        size={20}
                                    />
                                ) : (
                                    <AlertCircle
                                        className="text-danger"
                                        size={20}
                                    />
                                )}
                                <h5
                                    className="modal-title mb-0"
                                    id="statusFeedbackModalTitle"
                                >
                                    {title}
                                </h5>
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={onClose}
                            />
                        </div>

                        <div className="modal-body">
                            <p className="mb-0">{message}</p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className={`btn ${isSuccess ? "btn-success" : "btn-danger"}`}
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={onClose} />
        </>
    );
};

export default StatusFeedbackModal;
