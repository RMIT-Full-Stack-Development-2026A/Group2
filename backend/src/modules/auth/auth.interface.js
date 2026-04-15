const userReposistory = require("./auth.repository");

function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toExternalUserDto(userDoc) {
    return {
        id: String(userDoc._id),
        username: userDoc.username,
        email: userDoc.email,
        accountStatus: userDoc.accountStatus,
    };
}

function createAuthInterface() {
    async function listUsersForAdmin() {
        const users = await userReposistory.findAllUsers();

        return users.map(toExternalUserDto);
    }

    async function toggleUserAccountStatus(userId) {
        const user = await userReposistory.toggleUserAccountStatus(userId);
        return toExternalUserDto(user);
    }

    return {
        listUsersForAdmin,
        toggleUserAccountStatus,
    };
}

module.exports = {
    createAuthInterface,
};
