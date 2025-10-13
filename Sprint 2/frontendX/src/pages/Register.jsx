import React, { useState } from "react";
import { registerUser } from "../services/auth";

export default function Register({ goToLogin }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await registerUser(form);
            setSuccess("Registration successful! You can now log in.");
            setForm({ name: "", email: "", password: "", role: "student" });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        style={styles.input}
                    >
                        <option value="student">Student</option>
                        <option value="organizer">Organizer</option>
                    </select>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "lime" }}>{success}</p>}

                    <button type="submit" style={styles.button}>
                        Register
                    </button>
                </form>
                <p>
                    Already have an account?{" "}
                    <span style={styles.link} onClick={goToLogin}>
            Login
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
