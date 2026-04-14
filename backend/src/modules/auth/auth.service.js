const bcrypt = require("bcrypt");
const tokenUtils = require("../../shared/utils/token.utils");
const AppError = require("../../shared/utils/AppError");
const userRepository = require("./auth.repository");
const {
  validateRegisterBody,
} = require("./auth.validation");

function publicUserDto(userDoc) {
    return {
        id: String(userDoc._id),
        username: userDoc.username,
        role: userDoc.role,
        displayName: userDoc.displayName ?? userDoc.username,
    };
}

async function signUp(username, email, password, confirmPassword, country) {
    const validationErrors = validateRegisterBody({
        username,
        email,
        password,
        confirmPassword,
        country,
    });
    if (validationErrors.length) {
        throw new AppError("Validation failed.", {
            code: "VALIDATION_ERROR",
            statusCode: 400,
            errors: validationErrors,
        });
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new AppError("This email is already registered.", {
            code: "EMAIL_IN_USE",
            statusCode: 409,
            errors: [
                {
                    field: "email",
                    message: "Each account must use a unique email address.",
                    example:
                        "Try signing in, or register with a different email like friend@gmail.com",
                },
            ],
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let user;
    try {
        user = await userRepository.createUser({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            passwordHash,
            country,
            displayName: username.trim(),
        });
    } catch (e) {
        if (e?.code === 11000) {
            throw new AppError("This email is already registered.", {
                code: "EMAIL_IN_USE",
                statusCode: 409,
                errors: [
                    {
                        field: "email",
                        message:
                            "Each account must use a unique email address.",
                        example:
                            "Try signing in, or register with a different email like friend@gmail.com",
                    },
                ],
            });
        }
        throw e;
    }

    return publicUserDto(user);
}

async function logIn(identifier, password) {
    const user = await userRepository.findByUsernameOrEmail(identifier);

    if (!user) {
        throw new AppError(
            "Invalid email/username or password. Check spelling and try again.",
            {
                code: "INVALID_CREDENTIALS",
                statusCode: 401,
                failedLoginAttempt: true,
                errors: [
                    {
                        field: "identifier",
                        message:
                            "No matching account found, or the password is wrong.",
                        example:
                            "Example: sign in with your username (player_one) or email (you@example.com).",
                    },
                ],
            },
        );
    }

    if (user.accountStatus !== "active") {
        throw new AppError(
            "This account is deactivated and cannot sign in. Contact support if you think this is wrong.",
            {
                code: "ACCOUNT_INACTIVE",
                statusCode: 403,
                failedLoginAttempt: true,
                errors: [
                    {
                        field: "identifier",
                        message: "Your account status is not active.",
                        example:
                            "Example: use an active player account or ask an admin to reactivate your profile.",
                    },
                ],
            },
        );
    }

    if (!user.passwordHash) {
        throw new AppError(
            "Invalid email/username or password. Check spelling and try again.",
            {
                code: "INVALID_CREDENTIALS",
                statusCode: 401,
                failedLoginAttempt: true,
            },
        );
    }

    const correctPassword = await bcrypt.compare(password, user.passwordHash);

    if (!correctPassword) {
        throw new AppError(
            "Invalid email/username or password. Check spelling and try again.",
            {
                code: "INVALID_CREDENTIALS",
                statusCode: 401,
                failedLoginAttempt: true,
                errors: [
                    {
                        field: "password",
                        message:
                            "The password you entered does not match this account.",
                        example:
                            "Example: MyP@ssw0rd — 8+ characters, 1 uppercase, 1 number, 1 special character.",
                    },
                ],
            },
        );
    }

    const userId = String(user._id);
    const accessToken = tokenUtils.generateAccessToken(userId, user.role);
    const refreshToken = tokenUtils.generateRefreshToken(userId, user.role);

    return {
        accessToken,
        refreshToken,
        user: publicUserDto(user),
    };
}

async function refresh(refreshToken) {
    let decoded;
    try {
        decoded = tokenUtils.validateRefreshToken(refreshToken);
    } catch {
        throw new AppError("Refresh token is invalid or expired.", {
            code: "INVALID_REFRESH_TOKEN",
            statusCode: 401,
        });
    }

    const user = await userRepository.findById(decoded.id);

    if (!user) {
        throw new AppError("User not found.", {
            code: "USER_NOT_FOUND",
            statusCode: 401,
        });
    }

    if (user.accountStatus !== "active") {
        throw new AppError("This account is deactivated.", {
            code: "ACCOUNT_INACTIVE",
            statusCode: 403,
        });
    }

    return {
        accessToken: tokenUtils.generateAccessToken(
            String(user._id),
            user.role,
        ),
        user: publicUserDto(user),
    };
}

module.exports = {
    signUp,
    logIn,
    refresh,
};
