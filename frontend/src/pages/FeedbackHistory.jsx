import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFeedback, logoutUser } from "../api";

function FeedbackHistory() {

    const navigate = useNavigate();

    // ==========================================
    // STATES
    // ==========================================

    const [feedback, setFeedback] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // GET CUSTOMER FEEDBACK
    // ==========================================

    useEffect(() => {

        const loadFeedback = async () => {

            try {

                setLoading(true);

                setError("");

                const data = await getMyFeedback();

                console.log(
                    "My feedback:",
                    data
                );


                /*
                 * Depending on your backend response,
                 * feedback may be directly returned as
                 * an array or inside a "feedback" property.
                 */

                if (Array.isArray(data)) {

                    setFeedback(data);

                } else if (
                    Array.isArray(data.feedback)
                ) {

                    setFeedback(data.feedback);

                } else if (
                    Array.isArray(data.results)
                ) {

                    setFeedback(data.results);

                } else {

                    setFeedback([]);

                }

            } catch (error) {

                console.error(
                    "Failed to load feedback:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load your feedback."
                );

            } finally {

                setLoading(false);

            }

        };


        loadFeedback();

    }, []);


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        logoutUser();

        navigate("/");

    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    };


    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {

        if (!status) {
            return "pending";
        }

        return status
            .toLowerCase()
            .replace(/\s+/g, "-");

    };


    // ==========================================
    // RATING STARS
    // ==========================================

    const renderStars = (rating) => {

        const numericRating =
            Number(rating) || 0;

        return (

            <div className="history-stars">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        <span
                            key={star}
                            className={
                                star <= numericRating
                                    ? "history-star active"
                                    : "history-star"
                            }
                        >
                            ★
                        </span>

                    )
                )}

            </div>

        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="feedback-history-page">

                <header className="feedback-header">

                    <div className="header-brand">

                        <h1>
                            VIKING GRILL
                        </h1>

                        <span>
                            BAR • BILLARDS • KTV
                        </span>

                    </div>

                </header>


                <main className="history-container">

                    <div className="history-loading">

                        Loading your feedback...

                    </div>

                </main>

            </div>

        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="feedback-history-page">


            {/* ======================================
                HEADER
            ====================================== */}

            <header className="feedback-header">

                <div className="header-brand">

                    <h1>
                        VIKING GRILL
                    </h1>

                    <span>
                        BAR • BILLARDS • KTV
                    </span>

                </div>


                <nav className="history-nav" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                    <a
                        href="http://localhost:5176/menu"
                        style={{
                            padding: '8px 14px',
                            background: '#1f2937',
                            color: '#f3f4f6',
                            border: '1px solid #374151',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            textDecoration: 'none'
                        }}
                    >
                        ← Digital Menu
                    </a>

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() =>
                            navigate("/feedback")
                        }
                    >
                        Give Feedback
                    </button>

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </nav>

            </header>



            {/* ======================================
                MAIN
            ====================================== */}

            <main className="history-container">


                {/* PAGE INTRO */}

                <section className="history-intro">

                    <p className="section-label">
                        CUSTOMER FEEDBACK
                    </p>

                    <h2>
                        My Feedback
                    </h2>

                    <p>
                        View the feedback you have
                        submitted to Viking Grill.
                    </p>

                </section>



                {/* ERROR */}

                {error && (

                    <div className="history-error">

                        {error}

                    </div>

                )}



                {/* NO FEEDBACK */}

                {!error &&
                    feedback.length === 0 && (

                        <section className="empty-feedback">

                            <div className="empty-icon">
                                ★
                            </div>

                            <h3>
                                No Feedback Yet
                            </h3>

                            <p>
                                You haven't submitted
                                any feedback yet.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/feedback")
                                }
                            >
                                Submit Your First Feedback
                            </button>

                        </section>

                    )
                }



                {/* FEEDBACK LIST */}

                {feedback.length > 0 && (

                    <section className="history-list">

                        {feedback.map(
                            (item, index) => (

                                <article
                                    className="history-card"
                                    key={
                                        item.id ||
                                        index
                                    }
                                >


                                    {/* CARD HEADER */}

                                    <div className="history-card-header">

                                        <div>

                                            <p className="history-service-label">
                                                SERVICE
                                            </p>

                                            <h3>
                                                {
                                                    item.service ||
                                                    "Unknown Service"
                                                }
                                            </h3>

                                        </div>


                                        <span
                                            className={`feedback-status ${getStatusClass(
                                                item.status
                                            )}`}
                                        >
                                            {
                                                item.status ||
                                                "Pending"
                                            }
                                        </span>

                                    </div>



                                    {/* RATING */}

                                    <div className="history-rating">

                                        {renderStars(
                                            item.rating
                                        )}

                                        <span>
                                            {
                                                item.rating
                                            } / 5
                                        </span>

                                    </div>



                                    {/* COMMENT */}

                                    <div className="history-comment">

                                        <p>
                                            "
                                            {
                                                item.comment ||
                                                "No comment provided."
                                            }
                                            "
                                        </p>

                                    </div>



                                    {/* DATE */}

                                    <div className="history-date">

                                        Submitted on{" "}

                                        {formatDate(
                                            item.created_at ||
                                            item.date
                                        )}

                                    </div>


                                </article>

                            )
                        )}

                    </section>

                )}



                {/* BACK */}

                <div className="history-actions">

                    <button
                        onClick={() =>
                            navigate("/feedback")
                        }
                    >
                        ← Submit New Feedback
                    </button>

                </div>

            </main>

        </div>

    );

}

export default FeedbackHistory;