import React, { useEffect, useMemo, useState } from "react";
import EventCard from "../components/EventCard";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import api from "../api";

export default function LandingPage() {
    const { user } = useAuth();
    const [q, setQ] = useState("");
    const [events, setEvents] = useState([]);
    const [claimedIds, setClaimedIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
        if (user?.role === "student") loadClaimed();
    }, [user]);

    async function loadEvents() {
        try {
            setLoading(true);
            const { data } = await api.get("/events");

// Filter out cancelled and past events
            const now = new Date();
            const upcoming = data.filter(
                (e) =>
                    e.status !== "cancelled" &&
                    new Date(e.endTime) > now // only show events that haven't ended yet
            );

            setEvents(upcoming);

        } catch (err) {
            console.error(err);
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    }

    async function loadClaimed() {
        try {
            const { data } = await api.get("/tickets/my");
            setClaimedIds(data.map((t) => t.event?._id));
        } catch (err) {
            console.error("Failed to load claimed tickets:", err);
        }
    }

    async function handleClaim(event) {
        if (!user) return toast.info("Please log in to claim a ticket");

        // 🚫 prevent non-students from claiming
        if (user.role !== "student") {
            if (user.role === "organizer") {
                toast.error("Organizers cannot claim tickets for events.");
            } else if (user.role === "admin") {
                toast.error("Admins cannot register for events.");
            } else {
                toast.error("Only students can claim event tickets.");
            }
            return;
        }

        const toastId = toast.loading("Claiming your ticket...");
        try {
            const { data } = await api.post(`/tickets/claim/${event._id}`);
            toast.success(`🎟️ Registered for "${event.title}"`, { id: toastId });
            loadEvents();
            loadClaimed();
        } catch (err) {
            const msg = err?.response?.data?.error;
            if (msg === "Already claimed") {
                toast.info(`You've already registered for "${event.title}"`, { id: toastId });
            } else if (msg === "Event full") {
                toast.error(`Sorry, "${event.title}" is full.`, { id: toastId });
            } else if (msg === "Event not found") {
                toast.error("This event no longer exists.", { id: toastId });
            } else {
                toast.error("Could not claim your ticket. Try again later.", { id: toastId });
            }
        }
    }


    const filtered = useMemo(() => {
        const t = q.toLowerCase();
        return events.filter((e) =>
            [e.title, e.description, e.location, e.category]
                .filter(Boolean)
                .some((v) => v.toLowerCase().includes(t))
        );
    }, [q, events]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-gray-50 text-gray-800">
            {/* ===== HERO SECTION ===== */}
            <section className="text-center py-20 px-4 sm:px-6">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                    Discover, Attend & Connect 🎟️
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
                    Explore events happening on campus and beyond — workshops, socials,
                    and student-led activities all in one place.
                </p>

                <div className="flex justify-center">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search by title, location, or category..."
                        className="w-full max-w-xl rounded-full border border-gray-300 px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                    />
                </div>
            </section>

            {/* ===== EVENTS SECTION ===== */}
            <section className="flex-1 bg-white rounded-t-3xl py-12 px-6 sm:px-10 shadow-inner">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
                        {q ? "Search Results" : "Upcoming Events"}
                    </h2>

                    {loading ? (
                        <div className="text-center text-gray-600 mt-10">
                            Loading events…
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center text-gray-600 mt-10">
                            No events found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map((e) => (
                                <EventCard
                                    key={e._id}
                                    event={e}
                                    onClaim={handleClaim}
                                    claimed={claimedIds.includes(e._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="mt-16 text-center text-gray-500 text-sm py-6 border-t border-gray-100">
                © {new Date().getFullYear()} StudentEvent — Built for Concordia Students
            </footer>
        </div>
    );
}
