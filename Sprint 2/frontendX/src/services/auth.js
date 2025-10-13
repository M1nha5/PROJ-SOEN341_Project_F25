// frontendX/src/services/auth.js
const API_URL = "/api/users"; // proxy will send this to backendX

// Register new user
export const registerUser = async (userData) => {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
    }

    return res.json();
};

// Login user
export const loginUser = async (credentials) => {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
    }

    return res.json();
};
