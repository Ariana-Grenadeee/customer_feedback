require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const customerRecordsRoutes = require("./routes/customerRecordsRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const managementRoutes = require("./routes/managementRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const roleRoutes = require("./routes/roleRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Api routes
app.use("/api/customer", customerRoutes);

// Customer Records routes
app.use("/api/customer-records", customerRecordsRoutes);

// Feedback routes
app.use("/api/feedback", feedbackRoutes);

// Management routes
app.use("/api/management", managementRoutes);

// Analytics routes
app.use("/api/analytics", analyticsRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Role routes
app.use("/api/admin/roles", roleRoutes);

// Home / Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Customer Feedback & CRM Backend is running!"
    });
});

// Test Database
app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1 AS result", (err, results) => {
        if (err) {
            console.error("Database error:", err);

            return res.status(500).json({
                message: "Database connection failed"
            });
        }

        res.json({
            message: "Database connection successful!",
            result: results
        });
    });
});

// Get Roles
app.get("/api/roles", (req, res) => {
    db.query("SELECT * FROM roles", (err, results) => {
        if (err) {
            console.error("Database error:", err);

            return res.status(500).json({
                message: "Failed to get roles"
            });
        }

        res.json(results);
    });
});

// Start Server
const PORT = process.env.PORT || 4005;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});