const jwt = require("jsonwebtoken");

async function validateToken(req, res, next) {
    try {
        // Get access token from request header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        // Validate token
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

                
                // Find user by ID from decoded token
                const user = await user.findById(decoded.id);

                if (!user) {
                    return res.status(401).json({ message: "User not found" });
                }

                // Attach user to request object
                req.user = user;
                next();
            },
        );
    } catch (err) {
        console.error("Error validating token:", err);
        return res.status(401).json({ message: "Fail to validate" });
    }
}
