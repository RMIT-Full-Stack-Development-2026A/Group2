const { createAuthInterface } = require("../auth/auth.interface");

const authInterface = createAuthInterface();

async function getAllUsers() {
    return await authInterface.listUsersForAdmin();
}

async function toggleUserAccountStatus(userId) {
    return await authInterface.toggleUserAccountStatus(userId);
}

module.exports = {
    getAllUsers,
    toggleUserAccountStatus,
};
