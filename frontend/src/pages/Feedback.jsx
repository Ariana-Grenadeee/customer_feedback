import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitFeedback, logoutUser } from "../api";

function Feedback() {

    const navigate = useNavigate();

    // ==========================================
    // FORM STATES
    // ==========================================

    const [rating, setRating] = useState(0);

    const [service, setService] = useState("");

    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // SUBMIT FEEDBACK
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        // Clear previous messages
        setError("");
        setSuccess("");


        // Make sure rating is selected
        if (rating === 0) {

            setError(
                "Please select a rating before submitting."
            );

            return;

        }


        try {

            setLoading(true);


            // ==========================================
            // SEND FEEDBACK TO BACKEND
            // ==========================================

            const data = await submitFeedback({
                service,
                rating,
                comment
            });


            console.log(
                "Feedback submitted successfully:",
                data
            );


            // ==========================================
            // SUCCESS
            // ==========================================

            setSuccess(
                "Thank you! Your feedback has been submitted successfully."
            );


            // Clear form
            setService("");

            setRating(0);

            setComment("");


        } catch (error) {

            console.error(
                "Feedback submission error:",
                error
            );


            setError(
                error.message ||
                "Failed to submit feedback. Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        logoutUser();
    };


    // ==========================================
    // RATING TEXT
    // ==========================================

    const getRatingText = () => {

        if (rating === 0) {
            return "Select a rating";
        }

        if (rating === 1) {
            return "Very Poor";
        }

        if (rating === 2) {
            return "Poor";
        }

        if (rating === 3) {
            return "Average";
        }

        if (rating === 4) {
            return "Good";
        }

        if (rating === 5) {
            return "Excellent";
        }

        return "";

    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="feedback-page">


            {/* ======================================
                TOP NAVIGATION
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


                <nav style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

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
                        type="button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/feedback-history")
                        }
                    >
                        My Feedback
                    </button>


                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </nav>

            </header>



            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <main className="feedback-container">


                {/* ==================================
                    PAGE INTRO
                ================================== */}

                <section className="feedback-intro">

                    <p className="section-label">
                        CUSTOMER FEEDBACK
                    </p>

                    <h2>
                        Tell Us About Your Experience
                    </h2>

                    <p>
                        Your feedback helps Viking Grill
                        improve our services and provide a
                        better experience for our customers.
                    </p>

                </section>



                {/* ==================================
                    FEEDBACK CARD
                ================================== */}

                <section className="feedback-card">


                    {/* ==================================
                        SUCCESS MESSAGE
                    ================================== */}

                    {success && (

                        <div className="feedback-success">

                            {success}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/feedback-history"
                                    )
                                }
                            >
                                View My Feedback
                            </button>

                        </div>

                    )}



                    {/* ==================================
                        ERROR MESSAGE
                    ================================== */}

                    {error && (

                        <div className="feedback-error">

                            {error}

                        </div>

                    )}



                    {/* ==================================
                        FORM
                    ================================== */}

                    <form onSubmit={handleSubmit}>


                        {/* ==================================
                            SERVICE
                        ================================== */}

                        <div className="feedback-group">

                            <label htmlFor="service">
                                Service
                            </label>

                            <select
                                id="service"
                                value={service}
                                onChange={(e) =>
                                    setService(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select a service
                                </option>

                                <option value="Customer Service">
                                    Customer Service
                                </option>

                                <option value="Reservation">
                                    Reservation
                                </option>

                                <option value="Bar">
                                    Bar
                                </option>

                                <option value="Billiards">
                                    Billiards
                                </option>

                                <option value="KTV">
                                    KTV
                                </option>

                                <option value="Food and Beverage">
                                    Food & Beverage
                                </option>

                            </select>

                        </div>



                        {/* ==================================
                            RATING
                        ================================== */}

                        <div className="feedback-group">

                            <label>
                                How would you rate your
                                experience?
                            </label>


                            <div className="rating-container">

                                {[1, 2, 3, 4, 5].map(
                                    (star) => (

                                        <button
                                            key={star}
                                            type="button"
                                            className={
                                                star <= rating
                                                    ? "star active"
                                                    : "star"
                                            }
                                            onClick={() =>
                                                setRating(star)
                                            }
                                            aria-label={
                                                `${star} star rating`
                                            }
                                        >
                                            ★
                                        </button>

                                    )
                                )}

                            </div>


                            <p className="rating-text">
                                {getRatingText()}
                            </p>

                        </div>



                        {/* ==================================
                            COMMENT
                        ================================== */}

                        <div className="feedback-group">

                            <label htmlFor="comment">
                                Your Feedback
                            </label>

                            <textarea
                                id="comment"
                                rows="6"
                                placeholder="Tell us about your experience..."
                                value={comment}
                                onChange={(e) =>
                                    setComment(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>



                        {/* ==================================
                            SUBMIT
                        ================================== */}

                        <button
                            type="submit"
                            className="feedback-submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Submitting..."
                                : "Submit Feedback"
                            }

                        </button>


                    </form>

                </section>

            </main>

        </div>

    );

}

export default Feedback;