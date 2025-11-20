import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import StatsCard from "../components/dashboard/StatsCard";
import EventForm from "../components/EventForm";
import { Button } from "../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function OrganizerDashboard() {
    const { user, loaded } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showAttendees, setShowAttendees] = useState(null);
    const [attendees, setAttendees] = useState([]);

    // Cancel modal
    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (loaded && user?.role === "organizer") fetchEvents();
    }, [loaded, user]);

    async function fetchEvents() {
        try {
            setLoading(true);
            const res = await api.get("/events");
            const mine = res.data.filter(
                (e) => e.organization === user.id || e.organization?._id === user.id
            );
            setEvents(mine);
        } catch (err) {
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    }

    async function fetchAttendees(eventId) {
        try {
            const res = await api.get(`/events/${eventId}/attendees`);
            setAttendees(res.data);
            setShowAttendees(eventId);
        } catch {
            toast.error("Failed to load attendees");
        }
    }

    async function exportCSV(eventId) {
        try {
            const res = await api.get(`/events/${eventId}/attendees/export`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `attendees_${eventId}.csv`);
            document.body.appendChild(link);
            link.click();
        } catch {
            toast.error("Failed to export CSV");
        }
    }

    // Cancel flow
    function cancelEvent(event) {
        setCancelTarget(event);
        setCancelReason("");
    }

    async function confirmCancel() {
        if (!cancelTarget) return;
        if (!cancelReason.trim()) {
            toast.info("Please enter a reason");
            return;
        }

        try {
            setProcessing(true);
            const res = await api.patch(`/events/${cancelTarget._id}/cancel`, {
                reason: cancelReason.trim(),
            });
            toast.success(res.data.message || "Event cancelled successfully");
            setCancelTarget(null);
            await fetchEvents();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Failed to cancel event");
        } finally {
            setProcessing(false);
        }
    }

    // ✅ Organizer manually removes a student
    async function handleUnregisterStudent(eventId, userId, name) {
        try {
            const confirmed = window.confirm(`Remove ${name} from this event?`);
            if (!confirmed) return;

            await api.delete(`/events/${eventId}/attendees/${userId}`);
            toast.success(`${name} has been unregistered`);
            await fetchAttendees(eventId);
            await fetchEvents();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Failed to unregister student");
        }
    }

    const totalTickets = events.reduce((s, e) => s + (e.claimedCount || 0), 0);
    const totalCapacity = events.reduce((s, e) => s + (e.maxSignups || 0), 0);
    const capacityUsed = totalCapacity
        ? Math.round((totalTickets / totalCapacity) * 100)
        : 0;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Organizer Dashboard</h1>
                <Button onClick={() => setShowForm(true)}>+ Create Event</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatsCard label="Total Events" value={events.length} />
                <StatsCard label="Total Tickets Issued" value={totalTickets} />
                <StatsCard label="Capacity Used" value={`${capacityUsed}%`} />
            </div>

            {/* Events Table */}
            <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b text-left text-gray-600">
                        <th className="p-3">Title</th>
                        <th className="p-3">Schedule</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Capacity</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="p-6 text-center text-gray-500">
                                Loading...
                            </td>
                        </tr>
                    ) : events.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-6 text-center text-gray-500">
                                No events yet. Click “Create Event” to start!
                            </td>
                        </tr>
                    ) : (
                        events.map((ev) => (
                            <tr key={ev._id} className="border-t hover:bg-gray-50">
                                <td className="p-3 font-medium">{ev.title}</td>
                                <td className="p-3">
                                    {new Date(ev.startTime).toLocaleString()} –{" "}
                                    {new Date(ev.endTime).toLocaleString()}
                                </td>
                                <td className="p-3">{ev.location}</td>
                                <td className="p-3">
                                    {ev.claimedCount}/{ev.maxSignups}
                                </td>
                                <td
                                    className={`p-3 capitalize ${
                                        ev.status === "cancelled"
                                            ? "text-red-600 font-medium"
                                            : ""
                                    }`}
                                >
                                    {ev.status}
                                </td>
                                <td className="p-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                ⋮
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuItem
                                                onClick={() => fetchAttendees(ev._id)}
                                            >
                                                👥 View Attendees
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => exportCSV(ev._id)}>
                                                ⬇ Export CSV
                                            </DropdownMenuItem>
                                            {ev.status !== "cancelled" && (
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => cancelEvent(ev)}
                                                >
                                                    🚫 Cancel Event
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Create Event Modal */}
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
                        <button
                            className="absolute top-2 right-3 text-gray-400 hover:text-black"
                            onClick={() => setShowForm(false)}
                        >
                            ✕
                        </button>
                        <EventForm
                            onCreated={() => {
                                setShowForm(false);
                                fetchEvents();
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Attendees Modal */}
            {showAttendees && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg relative">
                        <button
                            className="absolute top-2 right-3 text-gray-400 hover:text-black"
                            onClick={() => {
                                setShowAttendees(null);
                                setAttendees([]);
                            }}
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-semibold mb-3">Attendees</h2>
                        {attendees.length === 0 ? (
                            <p className="text-gray-500">No attendees yet.</p>
                        ) : (
                            <table className="w-full text-sm border">
                                <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="p-2 text-left">Name</th>
                                    <th className="p-2 text-left">Email</th>
                                    <th className="p-2 text-left">Status</th>
                                    <th className="p-2 text-left">Checked In</th>
                                    <th className="p-2 text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {attendees.map((a, i) => (
                                    <tr key={i} className="border-t hover:bg-gray-50">
                                        <td className="p-2">{a.user?.name}</td>
                                        <td className="p-2">{a.user?.email}</td>
                                        <td className="p-2">{a.status}</td>
                                        <td className="p-2">
                                            {a.checkedInAt
                                                ? new Date(a.checkedInAt).toLocaleString()
                                                : "-"}
                                        </td>
                                        <td className="p-2 text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleUnregisterStudent(showAttendees, a.user._id, a.user.name)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {cancelTarget && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-3 text-gray-900">
                            Cancel “{cancelTarget.title}”
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Provide a reason for cancellation. All registered students will be notified.
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full h-24 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Enter reason for cancellation..."
                        />
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setCancelTarget(null)}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                                disabled={processing}
                            >
                                Close
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                                disabled={processing}
                            >
                                {processing ? "Cancelling..." : "Confirm Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
