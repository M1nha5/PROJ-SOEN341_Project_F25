import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../api";
import { toast } from "sonner";
import MyEventsList from "../components/MyEventsList";
import { Button } from "../components/ui/button";

// Localization setup
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales,
});

export default function MyEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("month");
    const [confirmEv, setConfirmEv] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    async function loadEvents() {
        try {
            setLoading(true);
            const { data } = await api.get("/tickets/my");
            const mapped = data.map((t) => ({
                id: t.event._id,
                title: t.event.title,
                start: t.event.startTime ? new Date(t.event.startTime) : new Date(),
                end: t.event.endTime
                    ? new Date(t.event.endTime)
                    : new Date(new Date().getTime() + 60 * 60 * 1000),
                location: t.event.location || "TBA",
                description: t.event.description || "",
                category: t.event.category || "",
                status: t.event.status || "active",
                priceType: t.event.priceType || "free",
                amount: t.event.amount || 0,
                maxSignups: t.event.maxSignups || 0,
                claimedCount: t.event.claimedCount || 0,
                ticketId: t._id,
            }));
            setEvents(mapped);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load your events");
        } finally {
            setLoading(false);
        }
    }


    async function handleUnregister(ev) {
        try {
            setProcessing(true);
            await api.delete(`/tickets/unclaim/${ev.id}`);
            toast.success("Unregistered successfully");
            setConfirmEv(null);
            loadEvents();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Failed to unregister");
        } finally {
            setProcessing(false);
        }
    }

    const onSelectEvent = (ev) => {
        setConfirmEv(ev);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">My Events</h1>

                {loading ? (
                    <div className="text-gray-600">Loading...</div>
                ) : events.length === 0 ? (
                    <div className="flex items-center justify-center h-[300px] text-gray-600 text-center">
                        <div>
                            <p className="text-lg font-medium">You have no registered events yet.</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Browse events on the home page to claim tickets.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Calendar */}
                        <div className="mb-8 bg-white border rounded-lg p-4 shadow-sm">
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                titleAccessor="title"
                                defaultView="month"
                                view={currentView}
                                date={currentDate}
                                onNavigate={(date) => setCurrentDate(date)}
                                onView={(view) => setCurrentView(view)}
                                step={60}
                                showMultiDayTimes
                                popup
                                style={{ height: 500 }}
                                onSelectEvent={onSelectEvent}
                            />
                        </div>

                        {/* List View */}
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold mb-2">List View</h2>
                            <MyEventsList events={events} onRefresh={loadEvents} />
                        </div>
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmEv && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-all duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
                        <h3 className="text-lg font-semibold mb-3">
                            Cancel registration?
                        </h3>
                        <p className="text-gray-600 text-sm mb-5">
                            Are you sure you want to unregister from{" "}
                            <b>{confirmEv.title}</b>?
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setConfirmEv(null)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleUnregister(confirmEv)}
                                disabled={processing}
                            >
                                {processing ? "Processing..." : "Yes, Unregister"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
