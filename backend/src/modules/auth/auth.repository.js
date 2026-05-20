const User = require("./model/user.model");
const Profile = require("../profile/profile.model");
const {createPremiumInterface} = require("../premium/premium.interface");

const premiumInterface = createPremiumInterface();

function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findByEmail(email) {
    return Profile.findOne({ email: email.toLowerCase() }).lean();
}

async function findByUsernameOrEmail(identifier) {
    const trimmed = String(identifier).trim();
    if (!trimmed) {
        return null;
    }
    if (trimmed.includes("@")) {
        const profile = await Profile.findOne({
            email: trimmed.toLowerCase(),
        }).lean();
        if (!profile) {
            return null;
        }
        const user = await User.findById(profile.userID)
            .select("+passwordHash")
            .lean();
        return mapAuthUser(user, profile);
    }
    const user = await User.findOne({
        username: new RegExp(`^${escapeRegex(trimmed)}$`, "i"),
    })
        .select("+passwordHash")
        .lean();
    if (!user) {
        return null;
    }
    const profile = await Profile.findOne({ userID: user._id }).lean();
    return mapAuthUser(user, profile);
}

async function createUser(userData) {
    const user = await User.create({
        username: userData.username,
        passwordHash: userData.passwordHash,
        role: userData.role ?? "player",
        accountStatus: userData.accountStatus ?? "active",
    });
    try {
        const profile = await Profile.create({
            userID: user._id,
            displayName: userData.displayName ?? userData.username,
            avatarURL: userData.avatarURL ?? null,
            country: userData.country,
            email: userData.email,
        });
        return mapAuthUser(user.toObject(), profile.toObject());
    } catch (error) {
        await User.findByIdAndDelete(user._id);
        throw error;
    }
}

async function findById(id) {
    const [user, profile] = await Promise.all([
        User.findById(id).lean(),
        Profile.findOne({ userID: id }).lean(),
    ]);
    if (!user) {
        return null;
    }
    return mapAuthUser(user, profile);
}

async function findByIdWithPasswordHash(id) {
    const [user, profile] = await Promise.all([
        User.findById(id).select("+passwordHash").lean(),
        Profile.findOne({ userID: id }).lean(),
    ]);
    if (!user) {
        return null;
    }
    return mapAuthUser(user, profile);
}

async function updateUser(id, update) {
    const user = await User.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true, runValidators: true },
    ).lean();
    if (!user) {
        return null;
    }
    const profile = await Profile.findOne({ userID: user._id }).lean();
    return mapAuthUser(user, profile);
}

function mapAuthUser(user, profile, isPremium = null) {
    if (!user) {
        return null;
    }
    return {
        _id: user._id,
        username: user.username,
        role: user.role,
        accountStatus: user.accountStatus,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: profile ?? null,
        email: profile?.email ?? null,
        country: profile?.country ?? null,
        avatarURL: profile?.avatarURL ?? null,
        avatarPublicId: profile?.avatarPublicId ?? null,
        displayName: profile?.displayName ?? user.username,
        profileCreatedAt: profile?.createdAt ?? null,
        profileUpdatedAt: profile?.updatedAt ?? null,
        isPremium: isPremium,
    };
}

async function findAllUsers() {
    const users = await User.find({ role: "player" }).lean();
    const combinedUsers = await Promise.all(
        users.map(async (user) => {
            const profile = await Profile.findOne({ userID: user._id }).lean();
            const isPremium = await premiumInterface.hasActiveSubscription(user._id);
            return mapAuthUser(user, profile, isPremium);
        }),
    );
    return combinedUsers;
}

async function toggleUserAccountStatus(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    user.accountStatus =
        user.accountStatus === "active" ? "deactivated" : "active";
    await user.save();
    const profile = await Profile.findOne({ userID: user._id }).lean();
    const isPremium = await premiumInterface.hasActiveSubscription(user._id);
    return mapAuthUser(user.toObject(), profile, isPremium);
}

// Blacklist management
const RefreshBlacklist = require("./model/refreshBlacklist.model");

async function addBlacklistedRefreshToken(token, userId, expiresAt) {
    return RefreshBlacklist.create({ token, userId, expiresAt });
}

async function isRefreshTokenBlacklisted(token) {
    const found = await RefreshBlacklist.findOne({ token }).lean();
    return !!found;
}

module.exports = {
    findByEmail,
    findByUsernameOrEmail,
    createUser,
    findById,
    findAllUsers,
    toggleUserAccountStatus,
    findByIdWithPasswordHash,
    updateUser,
    addBlacklistedRefreshToken,
    isRefreshTokenBlacklisted,
};
