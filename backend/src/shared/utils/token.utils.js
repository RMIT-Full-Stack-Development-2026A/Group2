const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

function generateAccessToken(userID) {
    const payload = { id: userID };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_TTL,
    });

    return accessToken;
}

function generateRefreshToken(userID) {
    const payload = { id: userID };
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_TTL,
    });

    return refreshToken;
}

function validateRefreshToken(token) {
    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err);
                throw new Error("Invalid token");
            }

            // Return decoded object if token is valid
            return decoded;
        },
    );
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    validateRefreshToken
};
