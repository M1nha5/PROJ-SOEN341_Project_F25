import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../api";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function AdminEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const sidebarItems = [
        { label: "Pending Organizers", to: "/admin", icon: "📝" },
        { label: "All Events", to: "/admin/events", icon: "📋" },
        { label: "Analytics", to: "/admin/analytics", icon: "📈" },
    ];

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            const { data } = await api.get("/admin/events");
            setEvents(data);
        } catch {
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    }

    async function cancelEvent(id) {
        if (!window.confirm("Cancel this event?")) return;
        try {
            await api.patch(`/events/${id}/cancel`, { reason: "Cancelled by admin" });
            toast.success("Event cancelled");
            fetchEvents();
        } catch (err) {
            toast.error(err?.response?.data?.error || "Failed to cancel event");
        }
    }

    return (
        <DashboardLayout sidebarTitle="Admin" sidebarItems={sidebarItems}>
            <h1 className="text-2xl font-semibold mb-4">All Events</h1>
            {loading ? (
                <div>Loading…</div>
            ) : events.length === 0 ? (
                <div className="text-gray-600">No events found.</div>
            ) : (
                <table className="w-full bg-white shadow-sm rounded-lg border">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Organizer</th>
                        <th className="p-3 text-left">Start</th>
                        <th className="p-3 text-left">End</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {events.map(ev => (
                        <tr key={ev._id} className="border-t">
                            <td className="p-3">{ev.title}</td>
                            <td className="p-3">{ev.organization?.name || "—"}</td>
                            <td className="p-3">{new Date(ev.startTime).toLocaleString()}</td>
                            <td className="p-3">{new Date(ev.endTime).toLocaleString()}</td>
                            <td className="p-3 capitalize">{ev.status}</td>
                            <td className="p-3">
                                {ev.status !== "cancelled" && (
                                    <button
                                        onClick={() => cancelEvent(ev._id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </DashboardLayout>
    );
}
