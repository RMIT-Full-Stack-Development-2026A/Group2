// JSON error body: status, code, message, optional errors.
function sendError(res, statusCode, code, message, errors) {
  const body = {
    status: "error",
    code,
    message,
  };
  if (errors?.length) {
    body.errors = errors;
  }
  return res.status(statusCode).json(body);
}

module.exports = { sendError };
