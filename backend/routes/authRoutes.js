const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();
const db = require("../db");

// ==========================================
// CUSTOMER REGISTRATION
// ==========================================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email, and password."
            });
        }

        // Check if email already exists
        const checkEmailSql = `
            SELECT *
            FROM users
            WHERE email = ?
        `;

        db.query(
            checkEmailSql,
            [email],
            async (err, results) => {

                if (err) {
                    console.error("Database error:", err);

                    return res.status(500).json({
                        message: "Database error."
                    });
                }

                if (results.length > 0) {
                    return res.status(400).json({
                        message: "Email is already registered."
                    });
                }

                // Find Customer role
                const roleSql = `
                    SELECT id
                    FROM roles
                    WHERE role_name = 'Customer'
                `;

                db.query(
                    roleSql,
                    async (err, roleResults) => {

                        if (err) {
                            console.error("Database error:", err);

                            return res.status(500).json({
                                message: "Database error."
                            });
                        }

                        if (roleResults.length === 0) {
                            return res.status(500).json({
                                message: "Customer role not found."
                            });
                        }

                        const customerRoleId = roleResults[0].id;

                        // Hash password
                        const hashedPassword =
                            await bcrypt.hash(password, 10);

                        // Insert customer
                        const insertSql = `
                            INSERT INTO users
                            (name, email, password, role_id)
                            VALUES (?, ?, ?, ?)
                        `;

                        db.query(
                            insertSql,
                            [
                                name,
                                email,
                                hashedPassword,
                                customerRoleId
                            ],
                            (err, result) => {

                                if (err) {
                                    console.error(
                                        "Database error:",
                                        err
                                    );

                                    return res.status(500).json({
                                        message:
                                            "Failed to register customer."
                                    });
                                }

                                res.status(201).json({
                                    message:
                                        "Customer registered successfully!",
                                    userId:
                                        result.insertId
                                });

                            }
                        );

                    }
                );

            }
        );

    } catch (error) {

        console.error("Server error:", error);

        res.status(500).json({
            message: "Server error."
        });

    }

});


// ==========================================
// CUSTOMER LOGIN
// ==========================================

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide email and password."
        });
    }

    // Find user
    const sql = `
        SELECT
            users.id,
            users.name,
            users.email,
            users.password,
            users.role_id,
            roles.role_name
        FROM users
        INNER JOIN roles
            ON users.role_id = roles.id
        WHERE users.email = ?
    `;

    db.query(
        sql,
        [email],
        async (err, results) => {

            if (err) {
                console.error("Database error:", err);

                return res.status(500).json({
                    message: "Database error."
                });
            }

            // User not found
            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            const user = results[0];

            // Check password
            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            // Create JWT token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role_id: user.role_id,
                    role: user.role_name
                },
                "vikings_secret_key",
                {
                    expiresIn: "1d"
                }
            );

            // Send response
            res.json({
                message: "Login successful!",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role_id: user.role_id,
                    role: user.role_name
                }
            });

        }
    );

});


// ==========================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// ==========================================

router.post("/forgot-password", (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required."
        });
    }

    // Generate random reset token
    const resetToken =
        crypto.randomBytes(32).toString("hex");

    // Token expires after 15 minutes
    const expiry = new Date(
        Date.now() + 15 * 60 * 1000
    );

    const sql = `
        UPDATE users
        SET
            reset_token = ?,
            reset_token_expiry = ?
        WHERE email = ?
    `;

    db.query(
        sql,
        [
            resetToken,
            expiry,
            email
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Forgot password error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to process forgot password request.",
                    error: err.message
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "No account found with that email."
                });

            }

            // For development/Postman testing,
            // we return the token directly.
            res.json({
                message:
                    "Password reset request successful.",

                resetToken:
                    resetToken,

                expiresAt:
                    expiry
            });

        }
    );

});


// ==========================================
// RESET PASSWORD
// POST /api/auth/reset-password
// ==========================================

router.post("/reset-password", async (req, res) => {

    const {
        resetToken,
        newPassword
    } = req.body;

    // Check required fields
    if (!resetToken || !newPassword) {

        return res.status(400).json({
            message:
                "Reset token and new password are required."
        });

    }

    // Check password length
    if (newPassword.length < 6) {

        return res.status(400).json({
            message:
                "Password must be at least 6 characters."
        });

    }

    // Find valid reset token
    const sql = `
        SELECT
            id,
            reset_token,
            reset_token_expiry
        FROM users
        WHERE reset_token = ?
        AND reset_token_expiry > NOW()
    `;

    db.query(
        sql,
        [resetToken],
        async (err, results) => {

            if (err) {

                console.error(
                    "Reset password error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to reset password.",
                    error:
                        err.message
                });

            }

            // Token doesn't exist or has expired
            if (results.length === 0) {

                return res.status(400).json({
                    message:
                        "Invalid or expired reset token."
                });

            }

            const userId = results[0].id;

            // Hash new password
            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    10
                );

            // Update password and remove reset token
            const updateSql = `
                UPDATE users
                SET
                    password = ?,
                    reset_token = NULL,
                    reset_token_expiry = NULL
                WHERE id = ?
            `;

            db.query(
                updateSql,
                [
                    hashedPassword,
                    userId
                ],
                (updateErr) => {

                    if (updateErr) {

                        console.error(
                            "Password update error:",
                            updateErr
                        );

                        return res.status(500).json({
                            message:
                                "Failed to update password.",
                            error:
                                updateErr.message
                        });

                    }

                    res.json({
                        message:
                            "Password reset successfully."
                    });

                }
            );

        }
    );

});


// ==========================================
// GET CURRENT USER (/me)
// ==========================================

router.get("/me", verifyToken, (req, res) => {
    const userId = req.user.id;
    const sql = `
        SELECT users.id, users.name, users.email, users.role_id, roles.role_name AS role
        FROM users
        LEFT JOIN roles ON users.role_id = roles.id
        WHERE users.id = ?
    `;

    db.query(sql, [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.json({
                message: "Current user session",
                user: req.user
            });
        }

        res.json({
            message: "Current user session",
            user: {
                id: results[0].id,
                name: results[0].name,
                email: results[0].email,
                role_id: results[0].role_id,
                role: results[0].role || req.user.role || "Customer"
            }
        });
    });
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;