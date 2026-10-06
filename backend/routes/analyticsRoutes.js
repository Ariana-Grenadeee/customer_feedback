const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();


// ======================================================
// CHECK MANAGEMENT ACCESS
// ======================================================

const checkManagementAccess = (req, res, next) => {

    const role = req.user.role;

    if (
        role !== "Management" &&
        role !== "Administrator" &&
        role !== "Staff"
    ) {
        return res.status(403).json({
            message: "Access denied. Management access required."
        });
    }

    next();
};


// ======================================================
// FEEDBACK ANALYTICS
// GET /api/analytics/feedback
// ======================================================

router.get(
    "/feedback",
    verifyToken,
    checkManagementAccess,
    (req, res) => {

        const summarySql = `
            SELECT
                COUNT(*) AS total_feedback,
                ROUND(AVG(rating), 2) AS average_rating,

                SUM(CASE
                    WHEN rating = 5 THEN 1
                    ELSE 0
                END) AS five_star,

                SUM(CASE
                    WHEN rating = 4 THEN 1
                    ELSE 0
                END) AS four_star,

                SUM(CASE
                    WHEN rating = 3 THEN 1
                    ELSE 0
                END) AS three_star,

                SUM(CASE
                    WHEN rating = 2 THEN 1
                    ELSE 0
                END) AS two_star,

                SUM(CASE
                    WHEN rating = 1 THEN 1
                    ELSE 0
                END) AS one_star,

                SUM(CASE
                    WHEN status = 'Pending' THEN 1
                    ELSE 0
                END) AS pending_feedback,

                SUM(CASE
                    WHEN status = 'Reviewed' THEN 1
                    ELSE 0
                END) AS reviewed_feedback,

                SUM(CASE
                    WHEN status = 'Resolved' THEN 1
                    ELSE 0
                END) AS resolved_feedback

            FROM feedback
        `;


        const serviceSql = `
            SELECT
                service,
                COUNT(*) AS total_feedback,
                ROUND(AVG(rating), 2) AS average_rating
            FROM feedback
            GROUP BY service
            ORDER BY total_feedback DESC
        `;


        db.query(summarySql, (err, summaryResults) => {

            if (err) {

                console.error(
                    "Analytics database error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to retrieve feedback analytics.",
                    error: err.message
                });
            }


            db.query(serviceSql, (err, serviceResults) => {

                if (err) {

                    console.error(
                        "Analytics database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to retrieve service analytics.",
                        error: err.message
                    });
                }


                res.json({
                    message: "Feedback analytics retrieved successfully.",

                    summary: summaryResults[0],

                    serviceAnalytics: serviceResults
                });

            });

        });

    }
);


module.exports = router;