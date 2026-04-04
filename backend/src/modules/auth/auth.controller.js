const authService = require("./auth.service");

async function signUp(req, res) {
    try {
        const { username, email, password, country } = req.body;

        const user = await authService.signUp(
            username,
            email,
            password,
            country,
        );

        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            user,
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
}

async function logIn(req, res) {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await authService.logIn(
            email,
            password,
        );

        // Set cookie FIRST
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Then send response
        res.status(200).json({
            status: "success",
            accessToken,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

function logOut(req, res) {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.json({ message: "No content" });
    }

    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    res.json({ message: "Logged out successfully" });
}

function refresh(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;
    try {
        const newAccessToken = authService.refresh(refreshToken);
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

module.exports = {
    signUp,
    logIn,
    logOut,
    refresh,
};
