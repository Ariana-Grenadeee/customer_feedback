const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();


// ======================================================
// CHECK ADMINISTRATOR ACCESS
// ======================================================

const checkAdminAccess = (req, res, next) => {

    if (req.user.role !== "Administrator") {

        return res.status(403).json({
            message: "Access denied. Administrator access required."
        });

    }

    next();
};


// ======================================================
// GET ALL ROLES
// GET /api/admin/roles
// ======================================================

router.get(
    "/",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const sql = `
            SELECT
                id,
                role_name
            FROM roles
            ORDER BY id ASC
        `;

        db.query(sql, (err, results) => {

            if (err) {

                console.error("Role database error:", err);

                return res.status(500).json({
                    message: "Failed to retrieve roles.",
                    error: err.message
                });

            }

            res.json({
                message: "Roles retrieved successfully.",
                roles: results
            });

        });

    }
);


// ======================================================
// CREATE ROLE
// POST /api/admin/roles
// ======================================================

router.post(
    "/",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const { role_name } = req.body;


        if (!role_name) {

            return res.status(400).json({
                message: "Role name is required."
            });

        }


        const sql = `
            INSERT INTO roles (role_name)
            VALUES (?)
        `;


        db.query(
            sql,
            [role_name],
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {

                        return res.status(409).json({
                            message: "Role already exists."
                        });

                    }

                    console.error(
                        "Role database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to create role.",
                        error: err.message
                    });

                }


                res.status(201).json({
                    message: "Role created successfully.",
                    roleId: result.insertId
                });

            }
        );

    }
);


// ======================================================
// UPDATE ROLE
// PUT /api/admin/roles/:id
// ======================================================

router.put(
    "/:id",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const roleId = req.params.id;
        const { role_name } = req.body;


        if (!role_name) {

            return res.status(400).json({
                message: "Role name is required."
            });

        }


        const sql = `
            UPDATE roles
            SET role_name = ?
            WHERE id = ?
        `;


        db.query(
            sql,
            [role_name, roleId],
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {

                        return res.status(409).json({
                            message: "Role already exists."
                        });

                    }

                    console.error(
                        "Role database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to update role.",
                        error: err.message
                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "Role not found."
                    });

                }


                res.json({
                    message: "Role updated successfully."
                });

            }
        );

    }
);


// ======================================================
// DELETE ROLE
// DELETE /api/admin/roles/:id
// ======================================================

router.delete(
    "/:id",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const roleId = req.params.id;


        // Do not allow deletion of roles currently assigned
        // to users.

        const checkSql = `
            SELECT COUNT(*) AS user_count
            FROM users
            WHERE role_id = ?
        `;


        db.query(
            checkSql,
            [roleId],
            (err, results) => {

                if (err) {

                    console.error(
                        "Role database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Database error.",
                        error: err.message
                    });

                }


                if (results[0].user_count > 0) {

                    return res.status(400).json({
                        message:
                            "Cannot delete this role because it is assigned to users."
                    });

                }


                const deleteSql = `
                    DELETE FROM roles
                    WHERE id = ?
                `;


                db.query(
                    deleteSql,
                    [roleId],
                    (err, result) => {

                        if (err) {

                            console.error(
                                "Role database error:",
                                err
                            );

                            return res.status(500).json({
                                message: "Failed to delete role.",
                                error: err.message
                            });

                        }


                        if (result.affectedRows === 0) {

                            return res.status(404).json({
                                message: "Role not found."
                            });

                        }


                        res.json({
                            message:
                                "Role deleted successfully."
                        });

                    }
                );

            }
        );

    }
);


module.exports = router;