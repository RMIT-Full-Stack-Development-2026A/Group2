import * as authService from "./auth.service.js";

async function signUp(req, res) {
  try {
    const { username, email, password, country } = req.body;
    const user = await authService.signUp(
      username,
      email,
      password,
      country,
    );
    res.status(201).json({ status: "success", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function logIn(req, res) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.logIn(
      email,
      password,
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      status: "success",
      accessToken,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function logOut(req, res) {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  res.json({ message: "Logged out successfully" });
}

export { signUp, logIn, logOut };
