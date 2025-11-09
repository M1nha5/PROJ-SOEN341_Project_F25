import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            try { const { data } = await api.get("/auth/me"); setUser(data); }
            catch { setUser(null); }
            finally { setLoaded(true); }
        })();
    }, []);

    const login = async (email, password) => {
        await api.post("/auth/login", { email, password });
        const { data } = await api.get("/auth/me");
        setUser(data);
    };

    const logout = async () => {
        try { await api.post("/auth/logout"); } catch {}
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
