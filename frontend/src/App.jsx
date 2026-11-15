import { useEffect } from "react";
import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import CentralLoginRedirect from "./CentralLoginRedirect";
import ProtectedRoute from "./ProtectedRoute";
import Feedback from "./pages/Feedback";
import FeedbackHistory from "./pages/FeedbackHistory";
import CustomerDashboard from "./pages/CustomerDashboard";
import ManagementFeedback from "./pages/ManagementFeedback";
import FeedbackAnalytics from "./pages/FeedbackAnalytics";

function AppContent() {
    // Auto-capture SSO token from VikingsERP Central Login
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const ssoToken = queryParams.get("token") || queryParams.get("sso_token");
        if (ssoToken) {
            localStorage.setItem("token", ssoToken);
            try {
                const base64Url = ssoToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                const decodedUser = JSON.parse(jsonPayload);
                localStorage.setItem("user", JSON.stringify({
                    id: decodedUser.id,
                    name: decodedUser.name,
                    email: decodedUser.email,
                    role: decodedUser.role || "Customer"
                }));
            } catch (err) {
                console.warn("Could not decode SSO token payload:", err);
            }
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }, []);

    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const token = localStorage.getItem("token");

    const getDefaultRoute = () => {
        if (!token) return "/login";
        const role = (user?.role || "").toLowerCase();
        if (role === "customer") return "/feedback";
        return "/management/feedback";
    };

    return (
        <Routes>
            {/* CENTRALIZED AUTH REDIRECTS */}
            <Route path="/" element={token ? <Navigate to={getDefaultRoute()} replace /> : <CentralLoginRedirect />} />
            <Route path="/login" element={<CentralLoginRedirect />} />
            <Route path="/register" element={<CentralLoginRedirect />} />

            {/* CUSTOMER ROUTES */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["Customer", "customer"]}>
                        <CustomerDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/feedback"
                element={
                    <ProtectedRoute allowedRoles={["Customer", "customer"]}>
                        <Feedback />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/feedback-history"
                element={
                    <ProtectedRoute allowedRoles={["Customer", "customer"]}>
                        <FeedbackHistory />
                    </ProtectedRoute>
                }
            />

            {/* MANAGEMENT ROUTES */}
            <Route
                path="/management/feedback"
                element={
                    <ProtectedRoute allowedRoles={["Owner", "Manager", "management", "Admin", "admin", "cashier", "reservation_staff", "accounting_staff"]}>
                        <ManagementFeedback />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/management/analytics"
                element={
                    <ProtectedRoute allowedRoles={["Owner", "Manager", "management", "Admin", "admin", "cashier", "reservation_staff", "accounting_staff"]}>
                        <FeedbackAnalytics />
                    </ProtectedRoute>
                }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
