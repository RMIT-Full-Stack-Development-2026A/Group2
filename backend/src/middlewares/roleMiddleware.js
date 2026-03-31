function roleMiddleware(_requiredRoles = []) {
  return (_req, _res, next) => {
    next();
  };
}

module.exports = {
  roleMiddleware,
};
