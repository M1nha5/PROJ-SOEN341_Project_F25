import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "sonner";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const sidebarItems = [
        { label: "Pending Organizers", to: "/admin", icon: "📝" },
        { label: "All Events", to: "/admin/events", icon: "📋" },
        { label: "Analytics", to: "/admin/analytics", icon: "📈" },
    ];

    useEffect(() => {
        fetchAnalytics();
    }, []);

    async function fetchAnalytics() {
        try {
            const { data } = await api.get("/admin/analytics");
            setStats(data);
        } catch {
            toast.error("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    }

    if (loading)
        return <div className="p-8 text-gray-600">Loading analytics...</div>;

    if (!stats)
        return <div className="p-8 text-red-500">Failed to load stats.</div>;

    const COLORS = ["#22c55e", "#f43f5e"]; // green, red
    const pieData = [
        { name: "Active", value: stats.activeEvents },
        { name: "Cancelled", value: stats.cancelledEvents },
    ];

    return (
        <DashboardLayout sidebarTitle="Admin" sidebarItems={sidebarItems}>
            <h1 className="text-2xl font-semibold mb-6">Platform Analytics</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white border rounded-xl p-5 shadow-sm">
                    <h2 className="text-gray-500 text-sm">Total Users</h2>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="bg-white border rounded-xl p-5 shadow-sm">
                    <h2 className="text-gray-500 text-sm">Total Events</h2>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
                </div>
                <div className="bg-white border rounded-xl p-5 shadow-sm">
                    <h2 className="text-gray-500 text-sm">Tickets Claimed</h2>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalTickets}</p>
                </div>
                <div className="bg-white border rounded-xl p-5 shadow-sm">
                    <h2 className="text-gray-500 text-sm">Active Events</h2>
                    <p className="text-2xl font-semibold text-green-600">{stats.activeEvents}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ticket Trends Line Chart */}
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Ticket Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.ticketTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Event Status Pie Chart */}
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Event Status Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </DashboardLayout>
    );
}
