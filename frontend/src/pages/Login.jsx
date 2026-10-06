import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            // Send login information to backend
            const data = await loginUser(
                email,
                password
            );

            console.log(
                "Login successful:",
                data
            );

            // Check user's role
            if (data.user.role === "Customer") {

                navigate("/dashboard");

            } else {

                // For management/admin accounts
                // we can add their dashboard later.

                navigate("/management/feedback");

            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                error.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                {/* BRAND */}

                <div className="brand">

                    <h1>
                        VIKING GRILL
                    </h1>

                    <p>
                        BAR <span>•</span> BILLARDS <span>•</span> KTV
                    </p>

                </div>


                {/* LOGIN TITLE */}

                <div className="auth-heading">

                    <h2>
                        Welcome Back
                    </h2>

                </div>


                {/* ERROR MESSAGE */}

                {error && (

                    <div className="login-error">

                        {error}

                    </div>

                )}


                {/* LOGIN FORM */}

                <form onSubmit={handleSubmit}>

                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing In..."
                            : "Sign In"
                        }

                    </button>

                </form>


                {/* CREATE ACCOUNT */}

                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create Account
                    </button>

                </div>

            </div>

        </div>

    );
}

export default Login;