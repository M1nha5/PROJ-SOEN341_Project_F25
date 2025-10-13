import React, { useState } from "react";
import { loginUser } from "../services/auth";

export default function Login({ onLoginSuccess, goToRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await loginUser({ email, password });
            localStorage.setItem("user", JSON.stringify(data.user));
            onLoginSuccess(data.user);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit" style={styles.button}>
                        Login
                    </button>
                </form>
                <p>
                    Don’t have an account?{" "}
                    <span style={styles.link} onClick={goToRegister}>
            Register
          </span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f1729",
        color: "white",
        fontFamily: "'Space Grotesk', sans-serif",
    },
    card: {
        background: "linear-gradient(135deg, #1e293b 0%, #111827 100%)",
        padding: "40px 60px",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
        textAlign: "center",
    },
    title: {
        fontSize: "2rem",
        marginBottom: "25px",
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    input: {
        display: "block",
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #334155",
        background: "#0b1222",
        color: "white",
        fontSize: "1rem",
    },
    button: {
        width: "100%",
        padding: "12px",
        background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
        color: "white",
        fontSize: "1rem",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
    link: {
        color: "#3b82f6",
        cursor: "pointer",
        textDecoration: "underline",
    },
};
