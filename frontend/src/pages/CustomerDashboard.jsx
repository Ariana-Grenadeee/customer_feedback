import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api";

function CustomerDashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-page">

            {/* HEADER */}
            <header className="dashboard-header">

                <div className="header-brand">
                    <h1>VIKING GRILL</h1>

                    <span>
                        BAR • BILLARDS • KTV
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                        className="dashboard-logout"
                        onClick={logoutUser}
                    >
                        Logout
                    </button>
                </div>

            </header>


            {/* MAIN */}
            <main className="dashboard-container">

                {/* WELCOME */}
                <section className="dashboard-welcome">

                    <p className="section-label">
                        CUSTOMER PORTAL
                    </p>

                    <h2>
                        Welcome Back!
                    </h2>

                    <p>
                        What would you like to do today?
                    </p>

                </section>


                {/* MODULE CARDS */}
                <section className="dashboard-grid">

                    {/* RESERVATION */}
                    <div className="dashboard-card">

                        <div className="dashboard-icon">
                            📅
                        </div>

                        <div className="dashboard-card-content">

                            <h3>
                                Reservation
                            </h3>

                            <p>
                                Make a reservation and manage
                                your upcoming visits to Viking Grill.
                            </p>

                            <button
                                className="dashboard-button"
                                onClick={() =>
                                    window.location.href = "http://localhost:5176/reservation"
                                }
                            >
                                Make Reservation
                            </button>

                        </div>

                    </div>


                    {/* FEEDBACK */}
                    <div className="dashboard-card">

                        <div className="dashboard-icon feedback-icon">
                            ★
                        </div>

                        <div className="dashboard-card-content">

                            <h3>
                                Customer Feedback
                            </h3>

                            <p>
                                Share your experience and help
                                us improve our services.
                            </p>

                            <button
                                className="dashboard-button"
                                onClick={() =>
                                    navigate("/feedback")
                                }
                            >
                                Give Feedback
                            </button>

                        </div>

                    </div>


                    {/* FEEDBACK HISTORY */}
                    <div className="dashboard-card">

                        <div className="dashboard-icon">
                            ◷
                        </div>

                        <div className="dashboard-card-content">

                            <h3>
                                My Feedback
                            </h3>

                            <p>
                                View your previous feedback,
                                ratings, and their status.
                            </p>

                            <button
                                className="dashboard-button secondary"
                                onClick={() =>
                                    navigate("/feedback-history")
                                }
                            >
                                View Feedback

                            </button>

                        </div>

                    </div>


                    {/* PROFILE */}
                    <div className="dashboard-card">

                        <div className="dashboard-icon">
                            ◉
                        </div>

                        <div className="dashboard-card-content">

                            <h3>
                                My Profile
                            </h3>

                            <p>
                                View and manage your customer
                                account information.
                            </p>

                            <button
                                className="dashboard-button secondary"
                                onClick={() =>
                                    console.log(
                                        "Profile module"
                                    )
                                }
                            >
                                View Profile
                            </button>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default CustomerDashboard;