const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4005/api";


// ==========================================
// GET SAVED TOKEN
// ==========================================

export const getToken = () => {
    return localStorage.getItem("token");
};


// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (email, password) => {

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message || "Login failed."
        );

    }


    // Save JWT token

    if (data.token) {

        localStorage.setItem(
            "token",
            data.token
        );

    }


    // Save user information

    if (data.user) {

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

    }


    return data;
};


// ==========================================
// LOGOUT
// ==========================================

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "http://localhost:5173/login";
};


// ==========================================
// SUBMIT FEEDBACK
// ==========================================

export const submitFeedback = async ({
    service,
    rating,
    comment
}) => {

    const token = getToken();


    // Make sure user is logged in

    if (!token) {

        throw new Error(
            "You are not logged in. Please login first."
        );

    }


    const response = await fetch(
        `${API_URL}/feedback`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",

                Authorization:
                    `Bearer ${token}`
            },

            body: JSON.stringify({
                service,
                rating,
                comment
            })
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to submit feedback."
        );

    }


    return data;
};


// ==========================================
// GET MY FEEDBACK
// ==========================================

export const getMyFeedback = async () => {

    const token = getToken();


    if (!token) {

        throw new Error(
            "You are not logged in. Please login first."
        );

    }


    const response = await fetch(
        `${API_URL}/feedback/my-feedback`,
        {
            method: "GET",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to retrieve feedback."
        );

    }


    return data;
};


// ==========================================
// GET FEEDBACK ANALYTICS
// ==========================================

export const getFeedbackAnalytics = async () => {

    const token = getToken();


    if (!token) {

        throw new Error(
            "You are not logged in. Please login first."
        );

    }


    const response = await fetch(
        `${API_URL}/analytics/feedback`,
        {
            method: "GET",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to retrieve analytics."
        );

    }


    return data;
};


// ======================================================
// MANAGEMENT - GET ALL CUSTOMER FEEDBACK
// ======================================================

export const getAllFeedback = async () => {

    const token = getToken();


    if (!token) {

        throw new Error(
            "You are not logged in. Please login first."
        );

    }


    const response = await fetch(
        `${API_URL}/management/feedback`,
        {
            method: "GET",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to retrieve all feedback."
        );

    }


    return data;
};


// ======================================================
// MANAGEMENT - UPDATE FEEDBACK STATUS
// ======================================================

export const updateFeedbackStatus = async (
    feedbackId,
    status
) => {

    const token = getToken();


    if (!token) {

        throw new Error(
            "You are not logged in. Please login first."
        );

    }


    const response = await fetch(
        `${API_URL}/management/feedback/${feedbackId}/status`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",

                Authorization:
                    `Bearer ${token}`
            },

            body: JSON.stringify({
                status: status
            })
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to update feedback status."
        );

    }


    return data;
};


// ======================================================
// MANAGEMENT - DELETE FEEDBACK
// ======================================================

export const deleteFeedback = async (
    feedbackId
) => {

    const token = getToken();


    if (!token) {

        throw new Error(
            "You are not logged in. Please login first."
        );

    }


    const response = await fetch(
        `${API_URL}/management/feedback/${feedbackId}`,
        {
            method: "DELETE",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to delete feedback."
        );

    }


    return data;
};