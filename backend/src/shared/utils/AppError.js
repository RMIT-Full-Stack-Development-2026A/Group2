// API error: message + HTTP code + optional field list.
class AppError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "AppError";
    this.code = options.code ?? "ERROR";
    this.statusCode = options.statusCode ?? 400;
    this.errors = options.errors;
    this.failedLoginAttempt = options.failedLoginAttempt === true;
  }
}

module.exports = AppError;
