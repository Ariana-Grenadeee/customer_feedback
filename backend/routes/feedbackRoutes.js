const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();


// ======================================================
// SUBMIT FEEDBACK
// POST /api/feedback
// ======================================================

router.post("/", verifyToken, (req, res) => {

    const userId = req.user.id;

    const {
        service,
        rating,
        comment
    } = req.body;


    // Check required fields
    if (!service || rating === undefined || rating === null) {
        return res.status(400).json({
            message: "Service and rating are required."
        });
    }


    // Convert rating to number
    const numericRating = Number(rating);


    // Check rating
    if (
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
    ) {
        return res.status(400).json({
            message: "Rating must be a whole number from 1 to 5."
        });
    }


    // Insert feedback
    const sql = `
        INSERT INTO feedback
        (
            user_id,
            service,
            rating,
            comment
        )
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            userId,
            service,
            numericRating,
            comment || null
        ],
        (err, result) => {

            if (err) {

                console.error("Feedback database error:", err);

                return res.status(500).json({
                    message: "Failed to submit feedback.",
                    error: err.message
                });
            }


            res.status(201).json({
                message: "Feedback submitted successfully!",
                feedbackId: result.insertId
            });

        }
    );

});


// ======================================================
// GET CUSTOMER'S OWN FEEDBACK
// GET /api/feedback/my-feedback
// ======================================================

router.get("/my-feedback", verifyToken, (req, res) => {

    const userId = req.user.id;


    const sql = `
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


    db.query(sql, [userId], (err, results) => {

        if (err) {

            console.error("Feedback database error:", err);

            return res.status(500).json({
                message: "Failed to retrieve feedback.",
                error: err.message
            });
        }


        res.json({
            message: "Feedback retrieved successfully.",
            feedback: results
        });

    });

});


// ======================================================
// GET ONE FEEDBACK
// GET /api/feedback/:id
// ======================================================

router.get("/:id", verifyToken, (req, res) => {

    const userId = req.user.id;
    const feedbackId = req.params.id;


    const sql = `
        SELECT
            id,
            service,
            rating,
            comment,
            status,
            created_at,
            updated_at
        FROM feedback
        WHERE id = ?
        AND user_id = ?
    `;


    db.query(
        sql,
        [feedbackId, userId],
        (err, results) => {

            if (err) {

                console.error("Feedback database error:", err);

                return res.status(500).json({
                    message: "Failed to retrieve feedback.",
                    error: err.message
                });
            }


            if (results.length === 0) {

                return res.status(404).json({
                    message: "Feedback not found."
                });

            }


            res.json({
                message: "Feedback retrieved successfully.",
                feedback: results[0]
            });

        }
    );

});


module.exports = router;