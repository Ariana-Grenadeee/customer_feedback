import { useState } from "react";
import { logoutUser } from "../api";

function ManagementFeedback() {
    const [filter, setFilter] = useState("All");

    // Sample UI data for now.
    // We will connect this to your API later.
    const feedbackList = [
        {
            id: 1,
            customer: "Test Customer",
            service: "Customer Service",
            rating: 5,
            comment:
                "The staff were very accommodating and friendly.",
            status: "Reviewed",
            date: "October 3, 2026"
        },
        {
            id: 2,
            customer: "Juan Dela Cruz",
            service: "KTV",
            rating: 4,
            comment:
                "The room was clean and the experience was good.",
            status: "Pending",
            date: "October 2, 2026"
        },
        {
            id: 3,
            customer: "Maria Santos",
            service: "Food and Beverage",
            rating: 3,
            comment:
                "The food was good, but the waiting time could be improved.",
            status: "Resolved",
            date: "September 30, 2026"
        }
    ];

    const filteredFeedback =
        filter === "All"
            ? feedbackList
            : feedbackList.filter(
                  (feedback) => feedback.status === filter
              );

    const renderStars = (rating) => {
        return (
            <div className="management-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={
                            star <= rating
                                ? "management-star active"
                                : "management-star"
                        }
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="management-page">

            {/* HEADER */}
            <header className="management-header">

                <div className="header-brand">
                    <h1>VIKING GRILL</h1>

                    <span>
                        BAR • BILLARDS • KTV
                    </span>
                </div>

                <div className="management-title">
                    <span>MANAGEMENT PORTAL</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <a
                        href="http://localhost:5173/dashboard"
                        style={{
                            padding: '8px 14px',
                            background: '#ef4444',
                            color: '#ffffff',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        ← Vikings ERP
                    </a>
                    <button
                        className="management-logout"
                        onClick={logoutUser}
                    >
                        Logout
                    </button>
                </div>

            </header>


            {/* MAIN */}
            <main className="management-container">

                {/* TITLE */}
                <section className="management-intro">

                    <p className="section-label">
                        CUSTOMER FEEDBACK
                    </p>

                    <h2>
                        Feedback Management
                    </h2>

                    <p>
                        Review customer feedback and monitor
                        the overall customer experience.
                    </p>

                </section>


                {/* SUMMARY */}
                <section className="analytics-summary">

                    <div className="summary-card">

                        <span className="summary-label">
                            TOTAL FEEDBACK
                        </span>

                        <strong>
                            3
                        </strong>

                    </div>


                    <div className="summary-card">

                        <span className="summary-label">
                            AVERAGE RATING
                        </span>

                        <strong>
                            4.0
                        </strong>

                        <span className="summary-stars">
                            ★ ★ ★ ★ ☆
                        </span>

                    </div>


                    <div className="summary-card">

                        <span className="summary-label">
                            PENDING
                        </span>

                        <strong>
                            1
                        </strong>

                    </div>


                    <div className="summary-card">

                        <span className="summary-label">
                            RESOLVED
                        </span>

                        <strong>
                            1
                        </strong>

                    </div>

                </section>


                {/* FILTER */}
                <section className="management-controls">

                    <div>

                        <label htmlFor="feedback-filter">
                            Filter Feedback
                        </label>

                        <select
                            id="feedback-filter"
                            value={filter}
                            onChange={(e) =>
                                setFilter(e.target.value)
                            }
                        >
                            <option value="All">
                                All Feedback
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Reviewed">
                                Reviewed
                            </option>

                            <option value="Resolved">
                                Resolved
                            </option>
                        </select>

                    </div>

                </section>


                {/* FEEDBACK TABLE */}
                <section className="management-feedback-section">

                    <div className="management-section-heading">

                        <div>
                            <p className="section-label">
                                SUBMISSIONS
                            </p>

                            <h3>
                                Customer Feedback
                            </h3>
                        </div>

                        <span>
                            {filteredFeedback.length} result(s)
                        </span>

                    </div>


                    <div className="feedback-table-wrapper">

                        <table className="feedback-table">

                            <thead>

                                <tr>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Rating</th>
                                    <th>Feedback</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredFeedback.map(
                                    (feedback) => (

                                        <tr key={feedback.id}>

                                            <td>
                                                <strong>
                                                    {feedback.customer}
                                                </strong>
                                            </td>

                                            <td>
                                                {feedback.service}
                                            </td>

                                            <td>
                                                <div className="table-rating">

                                                    {renderStars(
                                                        feedback.rating
                                                    )}

                                                    <span>
                                                        {
                                                            feedback.rating
                                                        }/5
                                                    </span>

                                                </div>
                                            </td>

                                            <td className="table-comment">
                                                {feedback.comment}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        "status-badge " +
                                                        feedback.status
                                                            .toLowerCase()
                                                            .replace(
                                                                " ",
                                                                "-"
                                                            )
                                                    }
                                                >
                                                    {feedback.status}
                                                </span>
                                            </td>

                                            <td className="table-date">
                                                {feedback.date}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default ManagementFeedback;