const express = require("express");
const bcrypt = require("bcryptjs");

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
// GET ALL USERS
// GET /api/admin/users
// ======================================================

router.get(
    "/users",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const sql = `
            SELECT
                users.id,
                users.name,
                users.email,
                users.role_id,
                roles.role_name,
                users.status
            FROM users
            INNER JOIN roles
                ON users.role_id = roles.id
            ORDER BY users.id DESC
        `;

        db.query(sql, (err, results) => {

            if (err) {

                console.error("User database error:", err);

                return res.status(500).json({
                    message: "Failed to retrieve users.",
                    error: err.message
                });

            }

            res.json({
                message: "Users retrieved successfully.",
                users: results
            });

        });

    }
);


// ======================================================
// GET ONE USER
// GET /api/admin/users/:id
// ======================================================

router.get(
    "/users/:id",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const userId = req.params.id;

        const sql = `
            SELECT
                users.id,
                users.name,
                users.email,
                users.role_id,
                roles.role_name,
                users.status
            FROM users
            INNER JOIN roles
                ON users.role_id = roles.id
            WHERE users.id = ?
        `;

        db.query(
            sql,
            [userId],
            (err, results) => {

                if (err) {

                    console.error("User database error:", err);

                    return res.status(500).json({
                        message: "Failed to retrieve user.",
                        error: err.message
                    });

                }

                if (results.length === 0) {

                    return res.status(404).json({
                        message: "User not found."
                    });

                }

                res.json({
                    message: "User retrieved successfully.",
                    user: results[0]
                });

            }
        );

    }
);


// ======================================================
// CREATE USER
// POST /api/admin/users
// ======================================================

router.post(
    "/users",
    verifyToken,
    checkAdminAccess,
    async (req, res) => {

        const {
            name,
            email,
            password,
            role_id
        } = req.body;

        if (!name || !email || !password || !role_id) {

            return res.status(400).json({
                message:
                    "Name, email, password, and role are required."
            });

        }

        try {

            // Check if email already exists

            const checkSql = `
                SELECT id
                FROM users
                WHERE email = ?
            `;

            db.query(
                checkSql,
                [email],
                async (err, results) => {

                    if (err) {

                        console.error(
                            "User database error:",
                            err
                        );

                        return res.status(500).json({
                            message: "Database error.",
                            error: err.message
                        });

                    }

                    if (results.length > 0) {

                        return res.status(409).json({
                            message:
                                "Email is already registered."
                        });

                    }

                    // Hash password

                    const hashedPassword =
                        await bcrypt.hash(password, 10);

                    // Insert user

                    const insertSql = `
                        INSERT INTO users
                        (
                            name,
                            email,
                            password,
                            role_id,
                            status
                        )
                        VALUES (?, ?, ?, ?, 'Active')
                    `;

                    db.query(
                        insertSql,
                        [
                            name,
                            email,
                            hashedPassword,
                            role_id
                        ],
                        (err, result) => {

                            if (err) {

                                console.error(
                                    "User database error:",
                                    err
                                );

                                return res.status(500).json({
                                    message:
                                        "Failed to create user.",
                                    error: err.message
                                });

                            }

                            res.status(201).json({
                                message:
                                    "User created successfully.",
                                userId:
                                    result.insertId
                            });

                        }
                    );

                }
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Server error."
            });

        }

    }
);


// ======================================================
// CHANGE USER ROLE
// PUT /api/admin/users/:id/role
// ======================================================

router.put(
    "/users/:id/role",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const userId = req.params.id;
        const { role_id } = req.body;

        if (!role_id) {

            return res.status(400).json({
                message: "role_id is required."
            });

        }

        const sql = `
            UPDATE users
            SET role_id = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [role_id, userId],
            (err, result) => {

                if (err) {

                    console.error(
                        "User database error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to update user role.",
                        error: err.message
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "User not found."
                    });

                }

                res.json({
                    message:
                        "User role updated successfully."
                });

            }
        );

    }
);


// ======================================================
// CHANGE USER STATUS
// PUT /api/admin/users/:id/status
// ======================================================

router.put(
    "/users/:id/status",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const userId = req.params.id;
        const { status } = req.body;

        const allowedStatuses = [
            "Active",
            "Inactive"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message:
                    "Status must be Active or Inactive."
            });

        }

        const sql = `
            UPDATE users
            SET status = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [status, userId],
            (err, result) => {

                if (err) {

                    console.error(
                        "User database error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to update user status.",
                        error: err.message
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "User not found."
                    });

                }

                res.json({
                    message:
                        "User status updated successfully."
                });

            }
        );

    }
);


// ======================================================
// DELETE USER
// DELETE /api/admin/users/:id
// ======================================================

router.delete(
    "/users/:id",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const userId = req.params.id;

        // Prevent administrator from deleting their own account

        if (Number(userId) === Number(req.user.id)) {

            return res.status(400).json({
                message:
                    "You cannot delete your own administrator account."
            });

        }

        const sql = `
            DELETE FROM users
            WHERE id = ?
        `;

        db.query(
            sql,
            [userId],
            (err, result) => {

                if (err) {

                    console.error(
                        "User database error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to delete user.",
                        error: err.message
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "User not found."
                    });

                }

                res.json({
                    message:
                        "User deleted successfully."
                });

            }
        );

    }
);


// ======================================================
// GET ALL PERMISSIONS
// GET /api/admin/permissions
// ======================================================

router.get(
    "/permissions",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const sql = `
            SELECT
                id,
                permission_name,
                description
            FROM permissions
            ORDER BY id
        `;

        db.query(sql, (err, results) => {

            if (err) {

                console.error(
                    "Permission database error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to retrieve permissions.",
                    error:
                        err.message
                });

            }

            res.json({
                message:
                    "Permissions retrieved successfully.",
                permissions:
                    results
            });

        });

    }
);


// ======================================================
// GET PERMISSIONS BY ROLE
// GET /api/admin/permissions/role/:roleId
// ======================================================

router.get(
    "/permissions/role/:roleId",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const roleId = req.params.roleId;

        const sql = `
            SELECT
                permissions.id,
                permissions.permission_name,
                permissions.description
            FROM role_permissions
            INNER JOIN permissions
                ON role_permissions.permission_id =
                   permissions.id
            WHERE role_permissions.role_id = ?
            ORDER BY permissions.id
        `;

        db.query(
            sql,
            [roleId],
            (err, results) => {

                if (err) {

                    console.error(
                        "Role permission database error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to retrieve role permissions.",
                        error:
                            err.message
                    });

                }

                res.json({
                    message:
                        "Role permissions retrieved successfully.",
                    permissions:
                        results
                });

            }
        );

    }
);


// ======================================================
// GET SYSTEM SETTINGS
// GET /api/admin/settings
// ======================================================

router.get(
    "/settings",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const sql = `
            SELECT
                id,
                setting_name,
                setting_value,
                description,
                updated_at
            FROM system_settings
            ORDER BY id
        `;

        db.query(sql, (err, results) => {

            if (err) {

                console.error(
                    "Settings database error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to retrieve system settings.",
                    error:
                        err.message
                });

            }

            res.json({
                message:
                    "System settings retrieved successfully.",
                settings:
                    results
            });

        });

    }
);


// ======================================================
// UPDATE SYSTEM SETTING
// PUT /api/admin/settings/:settingName
// ======================================================

router.put(
    "/settings/:settingName",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        const settingName =
            req.params.settingName;

        const { setting_value } =
            req.body;

        if (setting_value === undefined) {

            return res.status(400).json({
                message:
                    "setting_value is required."
            });

        }

        const sql = `
            UPDATE system_settings
            SET setting_value = ?
            WHERE setting_name = ?
        `;

        db.query(
            sql,
            [
                setting_value,
                settingName
            ],
            (err, result) => {

                if (err) {

                    console.error(
                        "Settings update error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to update system setting.",
                        error:
                            err.message
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message:
                            "System setting not found."
                    });

                }

                res.json({
                    message:
                        "System setting updated successfully."
                });

            }
        );

    }
);


// ======================================================
// ADMIN ROUTE TEST
// GET /api/admin/test
// ======================================================

router.get(
    "/test",
    verifyToken,
    checkAdminAccess,
    (req, res) => {

        res.json({
            message:
                "Administrator routes are working!"
        });

    }
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;