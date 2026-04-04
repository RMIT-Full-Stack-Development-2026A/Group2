import jwt from "jsonwebtoken";
import { UserModel } from "../modules/auth/auth.model.js";

async function validateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.error("Token verification error:", err);
          return res.status(401).json({ message: "Invalid token" });
        }

        const user = await UserModel.findById(decoded.id);

        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
      },
    );
  } catch (err) {
    console.error("Error validating token:", err);
    return res.status(401).json({ message: "Fail to validate" });
  }
}

export { validateToken };
