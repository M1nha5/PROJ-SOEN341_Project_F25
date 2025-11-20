import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function RegisterPage() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "student", // "student" | "organizer"
    });
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            return toast.info("Please fill in name, email, and password");
        }

        try {
            setLoading(true);
            // Register user
            await api.post("/auth/register", form);

            // Auto-login (refreshes auth context)
            await login(form.email, form.password);

            if (form.role === "organizer") {
                toast.success("Account created! Organizer status is pending admin approval.");
            } else {
                toast.success("Account created! You're logged in.");
            }

            nav("/");
        } catch (err) {
            toast.error(err?.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex justify-center items-start">
            {/* ✅ Keeps it higher on screen (same position as login) */}
            <div className="w-full max-w-md bg-white p-6 rounded-xl border shadow-sm mt-20">
                <h1 className="text-2xl font-semibold mb-4 text-center">
                    Create an account
                </h1>

                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="block text-sm mb-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={onChange}
                            placeholder="John Doe"
                            className="w-full rounded-lg border px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="you@email.com"
                            className="w-full rounded-lg border px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={onChange}
                            placeholder="••••••"
                            className="w-full rounded-lg border px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={onChange}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="student">Student</option>
                            <option value="organizer">Organizer</option>
                        </select>

                        {form.role === "organizer" && (
                            <p className="text-xs text-gray-500 mt-1">
                                Organizer accounts require admin approval before creating events.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 text-white py-2 hover:bg-blue-700 transition disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
