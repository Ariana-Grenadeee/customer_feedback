const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();


// ======================================================
// CHECK MANAGEMENT / STAFF ROLE
// ======================================================

const checkManagementAccess = (req, res, next) => {

    const role = req.user.role;

    if (
        role !== "Staff" &&
        role !== "Management" &&
        role !== "Administrator"
    ) {
        return res.status(403).json({
            message: "Access denied. Management access required."
        });
    }

    next();
};


// ======================================================
// GET ALL CUSTOMER FEEDBACK
// GET /api/management/feedback
// ======================================================

router.get(
    "/feedback",
    verifyToken,
    checkManagementAccess,
    (req, res) => {

        const sql = `
            SELECT
                feedback.id,
                feedback.service,
                feedback.rating,
                feedback.comment,
                feedback.status,
                feedback.created_at,
                feedback.updated_at,

                users.id AS user_id,
                users.name AS customer_name,
                users.email AS customer_email

            FROM feedback

            INNER JOIN users
                ON feedback.user_id = users.id

            ORDER BY feedback.created_at DESC
        `;


        db.query(sql, (err, results) => {

            if (err) {

                console.error(
                    "Feedback database error:",
                    err
                );

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

    }
);


// ======================================================
// GET ONE FEEDBACK
// GET /api/management/feedback/:id
// ======================================================

router.get(
    "/feedback/:id",
    verifyToken,
    checkManagementAccess,
    (req, res) => {

        const feedbackId = req.params.id;


        const sql = `
            SELECT
                feedback.id,
                feedback.service,
                feedback.rating,
                feedback.comment,
                feedback.status,
                feedback.created_at,
                feedback.updated_at,

                users.id AS user_id,
                users.name AS customer_name,
                users.email AS customer_email

            FROM feedback

            INNER JOIN users
                ON feedback.user_id = users.id

            WHERE feedback.id = ?
        `;


        db.query(
            sql,
            [feedbackId],
            (err, results) => {

                if (err) {

                    console.error(
                        "Feedback database error:",
                        err
                    );

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

    }
);


// ======================================================
// UPDATE FEEDBACK STATUS
// PUT /api/management/feedback/:id/status
// ======================================================

router.put(
    "/feedback/:id/status",
    verifyToken,
    checkManagementAccess,
    (req, res) => {

        const feedbackId = req.params.id;
        const { status } = req.body;


        const allowedStatuses = [
            "Pending",
            "Reviewed",
            "Resolved"
        ];


        if (!status) {

            return res.status(400).json({
                message: "Status is required."
            });

        }


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message:
                    "Invalid status. Use Pending, Reviewed, or Resolved."
            });

        }


        const sql = `
            UPDATE feedback
            SET status = ?
            WHERE id = ?
        `;


        db.query(
            sql,
            [status, feedbackId],
            (err, result) => {

                if (err) {

                    console.error(
                        "Feedback database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to update feedback.",
                        error: err.message
                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "Feedback not found."
                    });

                }


                res.json({
                    message: "Feedback status updated successfully."
                });

            }
        );

    }
);


// ======================================================
// DELETE FEEDBACK
// DELETE /api/management/feedback/:id
// ======================================================

router.delete(
    "/feedback/:id",
    verifyToken,
    checkManagementAccess,
    (req, res) => {

        const feedbackId = req.params.id;


        const sql = `
            DELETE FROM feedback
            WHERE id = ?
        `;


        db.query(
            sql,
            [feedbackId],
            (err, result) => {

                if (err) {

                    console.error(
                        "Feedback database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to delete feedback.",
                        error: err.message
                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "Feedback not found."
                    });

                }


                res.json({
                    message: "Feedback deleted successfully."
                });

            }
        );

    }
);


module.exports = router;