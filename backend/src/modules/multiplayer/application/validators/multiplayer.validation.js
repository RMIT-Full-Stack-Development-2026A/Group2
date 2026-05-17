function validateCreateRoom({ boardSize, marker1, marker2 }) {
    const errors = [];

    if (!boardSize || ![10, 15].includes(Number(boardSize))) {
        errors.push({ field: "boardSize", message: "Board size must be 10 or 15." });
    }

    if (!marker1) {
        errors.push({ field: "marker1", message: "Marker 1 is required." });
    }

    if (!marker2) {
        errors.push({ field: "marker2", message: "Marker 2 is required." });
    }

    if (marker1 === marker2) {
        errors.push({ field: "markers", message: "Markers must be different." });
    }

    return errors;
}

module.exports = { validateCreateRoom };