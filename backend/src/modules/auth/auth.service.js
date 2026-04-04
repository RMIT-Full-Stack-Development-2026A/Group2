const bcrypt = require("bcrypt");
const tokenUtils = require("../../shared/utils/token.utils");
const userRepository = require("./auth.repository");

async function signUp(username, email, password, country) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({
        username,
        email,
        passwordHash,
        country,
    });

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        country: user.country,
        role: user.role,
    };
}

async function logIn(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error("User doesn't exist");
    }

    const correctPassword = await bcrypt.compare(password, user.passwordHash);

    if (!correctPassword) {
        throw new Error("Password incorrect");
    }

    const accessToken = tokenUtils.generateAccessToken(user._id);
    const refreshToken = tokenUtils.generateRefreshToken(user._id);

    return {
        accessToken,
        refreshToken,
    };
}

async function refresh(refreshToken) {
    const decoded = tokenUtils.validateRefreshToken(refreshToken);

    // Check if user still exists
    const user = await userRepository.findById(decoded.id);

    if (!user) {
        throw new Error("User not found");
    }

    const newAccessToken = tokenUtils.generateAccessToken(user._id);
    return newAccessToken;
}

module.exports = {
    signUp,
    logIn,
    refresh,
};
