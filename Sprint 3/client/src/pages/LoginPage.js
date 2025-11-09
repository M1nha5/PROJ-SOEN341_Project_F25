import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (!email || !password) return toast.info("Enter email and password");
        try {
            setLoading(true);
            await login(email, password);
            toast.success("Logged in successfully");
            nav("/");
        } catch (err) {
            toast.error(err?.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex justify-center items-start">
            {/* ✅ Instead of full-center, use top margin for natural placement */}
            <div className="w-full max-w-md bg-white p-6 rounded-xl border shadow-sm mt-20">
                <h1 className="text-2xl font-semibold mb-4 text-center">Log in</h1>

                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            className="w-full rounded-lg border px-3 py-2"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            className="w-full rounded-lg border px-3 py-2"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 text-white py-2 hover:bg-blue-700 transition disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
