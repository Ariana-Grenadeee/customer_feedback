const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    // Check Bearer format
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Invalid token format."
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(
            token,
            "vikings_secret_key"
        );

        // Store user information in request
        req.user = decoded;

        // Continue to the requested route
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

module.exports = verifyToken;