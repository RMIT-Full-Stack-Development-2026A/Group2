const userReposistory = require("./auth.repository");

function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toExternalUserDto(userData) {
    return {
        id: String(userData._id),
        username: userData.username,
        email: userData.email,
        accountStatus: userData.accountStatus,
        isPremium: userData.isPremium,
    };
}

function createAuthInterface() {
    async function findUserById(userId) {
        return userReposistory.findById(userId);
    }

    async function updateUserById(userId, update) {
        return userReposistory.updateUser(userId, update);
    }

    async function listUsersForAdmin() {
        const users = await userReposistory.findAllUsers();

        return users.map(toExternalUserDto);
    }

    async function toggleUserAccountStatus(userId) {
        const user = await userReposistory.toggleUserAccountStatus(userId);
        return toExternalUserDto(user);
    }

    return {
        findUserById,
        updateUserById,
        listUsersForAdmin,
        toggleUserAccountStatus,
    };
}

module.exports = {
    createAuthInterface,
};
