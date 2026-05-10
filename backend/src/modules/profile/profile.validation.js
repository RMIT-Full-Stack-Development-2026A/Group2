const {
  validateUsername,
  validateEmail,
  validateCountry,
  validatePassword,
} = require("../auth/auth.validation");

function validateProfileUpdateBody(body) {
  const errors = [];
  const { username, displayName, email, country, avatarURL } = body ?? {};

  errors.push(...validateUsername(username));
  errors.push(...validateEmail(email));
  errors.push(...validateCountry(country));

  if (typeof displayName !== "string" || !displayName.trim()) {
    errors.push({
      field: "displayName",
      message: "Display name is required.",
      example: "Example: Player Alpha",
    });
  }

  if (
    avatarURL !== undefined &&
    avatarURL !== null &&
    (typeof avatarURL !== "string" || !avatarURL.trim())
  ) {
    errors.push({
      field: "avatarURL",
      message: "Avatar URL must be a valid string or null.",
      example: "Example: https://cdn.example.com/avatar.png",
    });
  }

  return errors;
}

function mapPasswordErrorsToField(errors, fieldName) {
  return errors.map((e) =>
    e.field === "password"
      ? { ...e, field: fieldName }
      : e,
  );
}

function validateChangePasswordBody(body) {
  const errors = [];
  const { newPassword, confirmNewPassword } = body ?? {};

  errors.push(
    ...mapPasswordErrorsToField(validatePassword(newPassword), "newPassword"),
  );

  if (
    typeof confirmNewPassword !== "string" ||
    confirmNewPassword !== newPassword
  ) {
    errors.push({
      field: "confirmNewPassword",
      message: "Confirm new password must match the new password exactly.",
      example: "Example: type the new password twice",
    });
  }

  return errors;
}

module.exports = {
  validateProfileUpdateBody,
  validateChangePasswordBody,
};
