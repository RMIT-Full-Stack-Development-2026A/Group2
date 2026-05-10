const { createAuthInterface } = require("../auth/auth.interface");

const authInterface = createAuthInterface();

async function getAllUsers() {
    return await authInterface.listUsersForAdmin();
}

async function toggleUserAccountStatus(userId) {
    return await authInterface.toggleUserAccountStatus(userId);
}

async function getSystemStats() {
    const users = await authInterface.listUsersForAdmin();
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.accountStatus === "active").length;
    const deactivatedUsers = totalUsers - activeUsers;
    return {
        totalUsers,
        activeUsers,
        deactivatedUsers,
    }
}

module.exports = {
    getAllUsers,
    toggleUserAccountStatus,
    getSystemStats,
};

