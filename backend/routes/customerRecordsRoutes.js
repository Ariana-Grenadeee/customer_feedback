const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();

// ==========================================
// GET CUSTOMER RECORDS
// ==========================================

router.get("/", verifyToken, (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            u.id,
            u.name,
            u.email,
            u.status,
            cp.phone,
            cp.address,
            cp.birthdate,
            cp.gender,
            u.created_at
        FROM users u
        LEFT JOIN customer_profiles cp
            ON u.id = cp.user_id
        WHERE u.id = ?
    `;

    db.query(sql, [userId], (err, userResults) => {

        if (err) {
            console.error("Customer record error:", err);

            return res.status(500).json({
                message: "Failed to retrieve customer record."
            });
        }

        if (userResults.length === 0) {
            return res.status(404).json({
                message: "Customer record not found."
            });
        }

        const feedbackSql = `
            SELECT
                id,
                service,
                rating,
                comment,
                status,
                created_at,
                updated_at
            FROM feedback
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;

        db.query(feedbackSql, [userId], (feedbackErr, feedbackResults) => {

            if (feedbackErr) {
                console.error("Customer feedback record error:", feedbackErr);

                return res.status(500).json({
                    message: "Failed to retrieve customer feedback records."
                });
            }

            res.json({
                message: "Customer records retrieved successfully.",
                customer: userResults[0],
                feedback: feedbackResults
            });

        });

    });

});

module.exports = router;