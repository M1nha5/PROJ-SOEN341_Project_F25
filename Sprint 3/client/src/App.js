import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import Navbar from "./components/Navbar.js";
import LandingPage from "./pages/LandingPage.js";
import DashboardPage from "./pages/DashboardPage.js";
import MyEventsPage from "./pages/MyEventsPage.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import AdminPage from "./pages/AdminPage.js";
import TicketVerifyPage from "./pages/TicketVerifyPage";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="min-h-screen bg-gray-50">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/my-events" element={<MyEventsPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/ticket/verify/:id" element={<TicketVerifyPage />} />
                        <Route path="/admin/events" element={<AdminEventsPage />} />
                        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}
