function validateCreateCheckoutSessionBody(body) {
  if (!body || Object.keys(body).length === 0) {
    return [];
  }

  return [
    {
      field: "body",
      message: "This endpoint does not accept request body fields.",
      example: "Example: send an empty body {}",
    },
  ];
}

module.exports = {
  validateCreateCheckoutSessionBody,
};
