import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Feedback from "./pages/Feedback";
import FeedbackHistory from "./pages/FeedbackHistory";
import CustomerDashboard from "./pages/CustomerDashboard";
import ManagementFeedback from "./pages/ManagementFeedback";
import FeedbackAnalytics from "./pages/FeedbackAnalytics";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* LOGIN */}
                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* CUSTOMER DASHBOARD */}
                <Route
                    path="/dashboard"
                    element={<CustomerDashboard />}
                />


                {/* CUSTOMER FEEDBACK */}
                <Route
                    path="/feedback"
                    element={<Feedback />}
                />


                {/* CUSTOMER FEEDBACK HISTORY */}
                <Route
                    path="/feedback-history"
                    element={<FeedbackHistory />}
                />


                {/* MANAGEMENT FEEDBACK */}
                <Route
                    path="/management/feedback"
                    element={<ManagementFeedback />}
                />


                {/* FEEDBACK ANALYTICS */}
                <Route
                    path="/management/analytics"
                    element={<FeedbackAnalytics />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;