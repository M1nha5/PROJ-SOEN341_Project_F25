import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { toast } from "sonner";

export default function TicketVerifyPage() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    async function fetchTicket() {
        try {
            setLoading(true);
            const { data } = await api.get(`/tickets/verify/${id}`);
            if (!data.valid) throw new Error("Invalid or expired ticket");
            setTicket(data);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-600 text-lg animate-pulse">Verifying ticket…</div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
                <div className="text-red-600 text-3xl font-bold mb-2">❌ Invalid Ticket</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <Link
                    to="/"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Back to Home
                </Link>
            </div>
        );

    const { event, user, status, checkedInAt } = ticket || {};
    const active = status === "claimed";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-gray-50 px-6 py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg text-center border border-gray-100 relative">
                <div
                    className={`absolute top-3 right-3 w-3 h-3 rounded-full animate-pulse ${
                        active ? "bg-green-500" : "bg-red-500"
                    }`}
                    title={active ? "Active" : "Inactive"}
                ></div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">🎟️ Ticket Verification</h1>
                <p
                    className={`text-lg font-semibold mb-6 ${
                        active ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {active ? "Ticket is VALID ✅" : "Ticket is INVALID ❌"}
                </p>

                {/* Event Info */}
                <div className="text-left text-gray-700 space-y-2 border-t border-gray-200 pt-4">
                    <p>
                        <b>Event:</b> {event?.title || "N/A"}
                    </p>
                    <p>
                        <b>Location:</b> {event?.location || "TBA"}
                    </p>
                    <p>
                        <b>Start:</b> {new Date(event?.startTime).toLocaleString()}
                    </p>
                    <p>
                        <b>End:</b> {new Date(event?.endTime).toLocaleString()}
                    </p>
                    <p>
                        <b>Category:</b> {event?.category || "General"}
                    </p>
                </div>

                {/* User Info */}
                <div className="text-left text-gray-700 space-y-2 border-t border-gray-200 mt-4 pt-4">
                    <p>
                        <b>Attendee:</b> {user?.name || "Unknown"}
                    </p>
                    <p>
                        <b>Email:</b> {user?.email || "—"}
                    </p>
                    {checkedInAt && (
                        <p>
                            <b>Checked In At:</b>{" "}
                            {new Date(checkedInAt).toLocaleString()}
                        </p>
                    )}
                </div>

                <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
