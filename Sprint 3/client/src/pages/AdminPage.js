import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import api from "../api";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import AdminPendingList from "../components/AdminPendingList";
import { Button } from "../components/ui/button";

export default function AdminPage() {
    const { user, loaded } = useAuth();
    const nav = useNavigate();
    const loc = useLocation();

    const [pending, setPending] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sidebar navigation
    const sidebarItems = [
        { label: "Pending Organizers", to: "/admin", icon: "📝" },
        { label: "All Events", to: "/admin/events", icon: "📋" },
        { label: "Analytics", to: "/admin/analytics", icon: "📈" },
    ];

    // Load user and route-specific data
    useEffect(() => {
        if (!loaded) return;
        if (!user) return nav("/login");
        if (user.role !== "admin") return nav("/");

        if (loc.pathname === "/admin") fetchPending();
        if (loc.pathname === "/admin/events") fetchEvents();
    }, [loaded, user, loc.pathname]);

    // Fetch pending organizers
    async function fetchPending() {
        try {
            setLoading(true);
            const { data } = await api.get("/admin/organizers/pending");
            setPending(data || []);
        } catch {
            toast.error("Failed to load pending organizers");
        } finally {
            setLoading(false);
        }
    }

    // Fetch all events
    async function fetchEvents() {
        try {
            setLoading(true);
            const { data } = await api.get("/events");
            setEvents(data || []);
        } catch {
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    }

    // Approve organizer
    async function approve(u) {
        try {
            await api.patch(`/admin/organizers/${u._id}/approve`);
            toast.success(`Approved ${u.name}`);
            fetchPending();
        } catch (e) {
            toast.error(e?.response?.data?.error || "Approve failed");
        }
    }

    // Reject organizer
    async function reject(u) {
        try {
            await api.patch(`/admin/organizers/${u._id}/reject`);
            toast.success(`Rejected ${u.name}`);
            fetchPending();
        } catch (e) {
            toast.error(e?.response?.data?.error || "Reject failed");
        }
    }

    // Cancel event
    async function cancelEvent(id) {
        const reason = prompt("Reason for cancellation:");
        if (!reason?.trim()) return toast.info("Cancellation reason required");
        try {
            await api.patch(`/events/${id}/cancel`, { reason });
            toast.success("Event cancelled successfully");
            fetchEvents();
        } catch (err) {
            toast.error(err?.response?.data?.error || "Failed to cancel event");
        }
    }

    if (!loaded) return null;

    // --- RENDER ---
    return (
        <DashboardLayout sidebarTitle="Admin" sidebarItems={sidebarItems}>
            {loc.pathname === "/admin" && (
                <>
                    <h1 className="text-2xl font-semibold mb-4">Pending Organizers</h1>
                    {loading ? (
                        <div className="text-gray-600">Loading…</div>
                    ) : (
                        <AdminPendingList
                            users={pending}
                            onApprove={approve}
                            onReject={reject}
                        />
                    )}
                </>
            )}

            {loc.pathname === "/admin/events" && (
                <>
                    <h1 className="text-2xl font-semibold mb-4">All Events</h1>
                    <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Organizer</th>
                                <th className="p-3 text-left">Schedule</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-gray-500">
                                        Loading events...
                                    </td>
                                </tr>
                            ) : events.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-gray-500">
                                        No events found.
                                    </td>
                                </tr>
                            ) : (
                                events.map((ev) => (
                                    <tr key={ev._id} className="border-t hover:bg-gray-50">
                                        <td className="p-3 font-medium">{ev.title}</td>
                                        <td className="p-3">{ev.organization?.name || "—"}</td>
                                        <td className="p-3">
                                            {new Date(ev.startTime).toLocaleString()} –{" "}
                                            {new Date(ev.endTime).toLocaleString()}
                                        </td>
                                        <td className="p-3 capitalize">{ev.status}</td>
                                        <td className="p-3 text-right">
                                            {ev.status !== "cancelled" && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => cancelEvent(ev._id)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {loc.pathname === "/admin/analytics" && (
                <div className="text-center text-gray-600 mt-20">
                    📊 Analytics dashboard coming soon!
                </div>
            )}
        </DashboardLayout>
    );
}
