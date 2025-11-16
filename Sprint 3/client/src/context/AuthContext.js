import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);

    // Load user on page refresh
    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");

            // No token → definitely logged out
            if (!token) {
                setLoaded(true);
                return;
            }

            try {
                const { data } = await api.get("/auth/me");
                setUser(data);
            } catch (err) {
                console.error("Auth /me load failed:", err);
                localStorage.removeItem("token"); // Token invalid → clear it
                setUser(null);
            } finally {
                setLoaded(true);
            }
        })();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password });

            // Save token
            localStorage.setItem("token", res.data.token);

            // Fetch fresh user data
            const me = await api.get("/auth/me");
            setUser(me.data);

            return { ok: true };
        } catch (err) {
            console.error("Login failed:", err);
            return {
                ok: false,
                error: err?.response?.data?.error || "Login failed",
            };
        }
    };

    // Logout
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.warn("Logout request failed (probably fine):", err);
        }

        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthCtx.Provider value={{ user, loaded, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}

export function useAuth() {
    return useContext(AuthCtx);
}
