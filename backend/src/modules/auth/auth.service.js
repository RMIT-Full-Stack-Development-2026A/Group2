import bcrypt from "bcrypt";
import * as tokenUtils from "../../shared/utils/token.utils.js";

async function signUp(username, email, password, country) {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    username,
    email,
    passwordHash,
    country,
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
  };
}

async function logIn(email, password) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("User doesn't exists");
  }

  const correctPassword = await bcrypt.compare(password, user.passwordHash);

  if (!correctPassword) {
    throw new Error("Password incorrect");
  }

  const accessToken = tokenUtils.generateAccessToken(user._id);
  const refreshToken = tokenUtils.generateRefreshToken(user._id);

  return {
    accessToken,
    refreshToken,
  };
}

export { signUp, logIn };
