// After JWT: require role in allowed list.
function authorizeRole(...allowedRoles) {
  const set = new Set(allowedRoles.flat());
  return function roleMiddleware(req, res, next) {
    const role = req.user?.role;
    if (!role || !set.has(role)) {
      return res.status(403).json({
        status: "error",
        code: "FORBIDDEN",
        message:
          "You do not have permission for this action. Example: this area is only for admin accounts.",
      });
    }
    next();
  };
}

module.exports = authorizeRole;
