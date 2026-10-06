import { useNavigate } from "react-router-dom";

function FeedbackAnalytics() {
    const navigate = useNavigate();

    // Sample data for UI design.
    // We will replace this with your real API data later.
    const analytics = {
        total_feedback: 1,
        average_rating: "5.00",
        five_star: 1,
        four_star: 0,
        three_star: 0,
        two_star: 0,
        one_star: 0,
        pending_feedback: 0,
        reviewed_feedback: 1,
        resolved_feedback: 0
    };

    const serviceAnalytics = [
        {
            service: "Customer Service",
            total_feedback: 1,
            average_rating: "5.00"
        }
    ];

    return (
        <div className="analytics-page">

            {/* HEADER */}
            <header className="analytics-header">

                <div className="header-brand">
                    <h1>VIKING GRILL</h1>

                    <span>
                        BAR • BILLARDS • KTV
                    </span>
                </div>

                <div className="analytics-header-title">
                    MANAGEMENT PORTAL
                </div>

                <button
                    className="analytics-back-button"
                    onClick={() =>
                        navigate("/management/feedback")
                    }
                >
                    Back to Feedback
                </button>

            </header>


            {/* MAIN */}
            <main className="analytics-container">

                {/* INTRO */}
                <section className="analytics-intro">

                    <p className="section-label">
                        CUSTOMER FEEDBACK
                    </p>

                    <h2>
                        Feedback Analytics
                    </h2>

                    <p>
                        Monitor customer ratings, feedback
                        status, and service performance.
                    </p>

                </section>


                {/* OVERVIEW */}
                <section className="analytics-overview">

                    <div className="analytics-overview-card">

                        <span>
                            TOTAL FEEDBACK
                        </span>

                        <strong>
                            {analytics.total_feedback}
                        </strong>

                    </div>


                    <div className="analytics-overview-card">

                        <span>
                            AVERAGE RATING
                        </span>

                        <strong>
                            {analytics.average_rating}
                        </strong>

                        <div className="overview-stars">
                            ★★★★★
                        </div>

                    </div>


                    <div className="analytics-overview-card">

                        <span>
                            REVIEWED
                        </span>

                        <strong>
                            {analytics.reviewed_feedback}
                        </strong>

                    </div>


                    <div className="analytics-overview-card">

                        <span>
                            PENDING
                        </span>

                        <strong>
                            {analytics.pending_feedback}
                        </strong>

                    </div>

                </section>


                {/* TWO COLUMN AREA */}
                <section className="analytics-grid">

                    {/* RATING BREAKDOWN */}
                    <div className="analytics-panel">

                        <div className="analytics-panel-heading">

                            <div>
                                <p className="section-label">
                                    RATINGS
                                </p>

                                <h3>
                                    Rating Breakdown
                                </h3>
                            </div>

                        </div>


                        <div className="rating-breakdown">

                            <RatingRow
                                rating="5"
                                count={analytics.five_star}
                                total={analytics.total_feedback}
                            />

                            <RatingRow
                                rating="4"
                                count={analytics.four_star}
                                total={analytics.total_feedback}
                            />

                            <RatingRow
                                rating="3"
                                count={analytics.three_star}
                                total={analytics.total_feedback}
                            />

                            <RatingRow
                                rating="2"
                                count={analytics.two_star}
                                total={analytics.total_feedback}
                            />

                            <RatingRow
                                rating="1"
                                count={analytics.one_star}
                                total={analytics.total_feedback}
                            />

                        </div>

                    </div>


                    {/* STATUS */}
                    <div className="analytics-panel">

                        <div className="analytics-panel-heading">

                            <div>
                                <p className="section-label">
                                    STATUS
                                </p>

                                <h3>
                                    Feedback Status
                                </h3>
                            </div>

                        </div>


                        <div className="status-analytics">

                            <StatusRow
                                label="Pending"
                                count={
                                    analytics.pending_feedback
                                }
                                className="pending"
                            />

                            <StatusRow
                                label="Reviewed"
                                count={
                                    analytics.reviewed_feedback
                                }
                                className="reviewed"
                            />

                            <StatusRow
                                label="Resolved"
                                count={
                                    analytics.resolved_feedback
                                }
                                className="resolved"
                            />

                        </div>

                    </div>

                </section>


                {/* SERVICE ANALYTICS */}
                <section className="analytics-panel service-panel">

                    <div className="analytics-panel-heading">

                        <div>
                            <p className="section-label">
                                SERVICES
                            </p>

                            <h3>
                                Service Performance
                            </h3>
                        </div>

                        <span>
                            {serviceAnalytics.length} service(s)
                        </span>

                    </div>


                    <div className="service-table-wrapper">

                        <table className="service-table">

                            <thead>

                                <tr>
                                    <th>Service</th>
                                    <th>Total Feedback</th>
                                    <th>Average Rating</th>
                                </tr>

                            </thead>

                            <tbody>

                                {serviceAnalytics.map(
                                    (service) => (

                                        <tr
                                            key={service.service}
                                        >

                                            <td>
                                                <strong>
                                                    {service.service}
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    service.total_feedback
                                                }
                                            </td>

                                            <td>

                                                <div className="service-rating">

                                                    <span>
                                                        ★
                                                    </span>

                                                    {
                                                        service.average_rating
                                                    }

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>


                {/* BACK BUTTON */}
                <div className="analytics-actions">

                    <button
                        onClick={() =>
                            navigate("/management/feedback")
                        }
                    >
                        ← Back to Feedback Management
                    </button>

                </div>

            </main>

        </div>
    );
}


/* =========================================
   RATING ROW
========================================= */

function RatingRow({ rating, count, total }) {

    const percentage =
        total > 0
            ? (count / total) * 100
            : 0;

    return (
        <div className="rating-row">

            <div className="rating-label">
                <span>
                    {rating}
                </span>

                <span className="small-star">
                    ★
                </span>
            </div>

            <div className="rating-bar">

                <div
                    className="rating-bar-fill"
                    style={{
                        width: `${percentage}%`
                    }}
                />

            </div>

            <span className="rating-count">
                {count}
            </span>

        </div>
    );
}


/* =========================================
   STATUS ROW
========================================= */

function StatusRow({ label, count, className }) {

    return (
        <div className="status-row">

            <div className="status-row-name">

                <span
                    className={`status-dot ${className}`}
                />

                {label}

            </div>

            <strong>
                {count}
            </strong>

        </div>
    );
}

export default FeedbackAnalytics;