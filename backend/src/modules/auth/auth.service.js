const bcrypt = require("bcrypt");
const tokenUtils = require("../../shared/utils/token.utils"); 

async function signUp(username, email, password, country) {
    // Check if email exists
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    // hash password
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
    };
}

async function logIn(email, password) {
    // Get user for hashed password comparison
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error("User doesn't exists");
    }

    const correctPassword = await bcrypt.compare(password, user.passwordHash);

    if (!correctPassword) {
        throw new Error("Password incorrect");
    }

    // Correct password, generate JWT refresh and access token 
    const accessToken = tokenUtils.generateAccessToken(user._id);
    const refreshToken = tokenUtils.generateRefreshToken(user._id);

    return {
        accessToken,
        refreshToken,
    };
}

module.exports = {
    signUp,
    logIn,
};
