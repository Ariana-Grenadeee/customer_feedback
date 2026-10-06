const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();

// ==========================================
// GET CUSTOMER PROFILE
// ==========================================

router.get("/profile", verifyToken, (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            users.id,
            users.name,
            users.email,
            roles.role_name,
            customer_profiles.phone,
            customer_profiles.address,
            customer_profiles.birthdate,
            customer_profiles.gender
        FROM users
        INNER JOIN roles
            ON users.role_id = roles.id
        LEFT JOIN customer_profiles
            ON users.id = customer_profiles.user_id
        WHERE users.id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.error("Database error:", err);

            return res.status(500).json({
                message: "Database error."
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Customer not found."
            });
        }

        res.json({
            message: "Customer profile retrieved successfully.",
            profile: results[0]
        });
    });
});


// ==========================================
// UPDATE CUSTOMER PROFILE
// ==========================================

router.put("/profile", verifyToken, (req, res) => {

    const userId = req.user.id;

    const {
        name,
        phone,
        address,
        birthdate,
        gender
    } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required."
        });
    }

    // Update name in users table
    const updateUserSql = `
        UPDATE users
        SET name = ?
        WHERE id = ?
    `;

    db.query(
        updateUserSql,
        [name, userId],
        (err) => {

            if (err) {
                console.error("Database error:", err);

                return res.status(500).json({
                    message: "Failed to update name."
                });
            }

            // Check if profile already exists
            const checkProfileSql = `
                SELECT id
                FROM customer_profiles
                WHERE user_id = ?
            `;

            db.query(
                checkProfileSql,
                [userId],
                (err, results) => {

                    if (err) {
                        console.error("Database error:", err);

                        return res.status(500).json({
                            message: "Database error."
                        });
                    }

                    // ==========================================
                    // PROFILE EXISTS → UPDATE
                    // ==========================================

                    if (results.length > 0) {

                        const updateProfileSql = `
                            UPDATE customer_profiles
                            SET
                                phone = ?,
                                address = ?,
                                birthdate = ?,
                                gender = ?
                            WHERE user_id = ?
                        `;

                        db.query(
                            updateProfileSql,
                            [
                                phone,
                                address,
                                birthdate,
                                gender,
                                userId
                            ],
                            (err) => {

                                if (err) {
                                    console.error("Database error:", err);

                                    return res.status(500).json({
                                        message: "Failed to update profile."
                                    });
                                }

                                res.json({
                                    message: "Customer profile updated successfully."
                                });
                            }
                        );

                    }

                    // ==========================================
                    // PROFILE DOES NOT EXIST → CREATE
                    // ==========================================

                    else {

                        const insertProfileSql = `
                            INSERT INTO customer_profiles
                            (
                                user_id,
                                phone,
                                address,
                                birthdate,
                                gender
                            )
                            VALUES (?, ?, ?, ?, ?)
                        `;

                        db.query(
                            insertProfileSql,
                            [
                                userId,
                                phone,
                                address,
                                birthdate,
                                gender
                            ],
                            (err) => {

                                if (err) {
                                    console.error("Database error:", err);

                                    return res.status(500).json({
                                        message: "Failed to create profile."
                                    });
                                }

                                res.json({
                                    message: "Customer profile created successfully."
                                });
                            }
                        );
                    }
                }
            );
        }
    );
});

module.exports = router;