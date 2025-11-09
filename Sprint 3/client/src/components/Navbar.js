import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function Navbar() {
    const { user, loaded, logout } = useAuth();
    const nav = useNavigate();

    const onLogout = async () => {
        await logout();
        toast.success("Logged out");
        nav("/");
    };

    return (
        <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b">
            {/* Left: logo */}
            <Link
                to="/"
                className="text-2xl font-semibold text-blue-600 flex items-center gap-1"
            >
                🎟️ <span>StudentEvent</span>
            </Link>

            {/* Right: controls */}
            {!loaded ? null : user ? (
                <div className="flex items-center gap-3">
                    {/* Name and role */}
                    <span className="text-sm text-gray-700 hidden sm:inline">
            {user.name || "User"} • {user.role}
          </span>

                    {/* Role-specific buttons */}
                    {user.role === "admin" && (
                        <Link to="/admin">
                            <Button variant="outline">Admin</Button>
                        </Link>
                    )}

                    {user.role === "student" && (
                        <Link to="/my-events">
                            <Button variant="outline">My Events</Button>
                        </Link>
                    )}

                    {user.role === "organizer" && (
                        <Link to="/dashboard">
                            <Button variant="outline">Dashboard</Button>
                        </Link>
                    )}

                    {/* Logout */}
                    <Button onClick={onLogout}>Logout</Button>
                </div>
            ) : (
                <div className="space-x-3">
                    <Link to="/login">
                        <Button variant="outline">Login</Button>
                    </Link>
                    <Link to="/register">
                        <Button>Register</Button>
                    </Link>
                </div>
            )}
        </nav>
    );
}
