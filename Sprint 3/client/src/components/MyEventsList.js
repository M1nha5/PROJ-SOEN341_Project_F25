import EventChat from "./EventChat";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import api from "../api";

function fmt(dt) {
    if (!dt) return "TBA";
    const d = new Date(dt);
    return isNaN(d.getTime()) ? "TBA" : d.toLocaleString();
}

export default function MyEventsList({ events = [], onRefresh }) {
    const [selected, setSelected] = useState(null);
    const [confirmUnreg, setConfirmUnreg] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [tab, setTab] = useState("details"); // ✅ NEW TAB STATE

    if (!events || events.length === 0) {
        return (
            <div className="bg-white border rounded-xl p-8 shadow-sm text-gray-600 text-center">
                <h2 className="text-lg font-semibold mb-2">No events yet</h2>
                <p className="text-sm text-gray-500">
                    You have no registered or created events at the moment.
                </p>
            </div>
        );
    }

    async function handleUnregister(ev) {
        try {
            setProcessing(true);
            await api.delete(`/tickets/unclaim/${ev._id || ev.id}`);
            toast.success("Unregistered successfully");
            setSelected(null);
            setConfirmUnreg(false);
            onRefresh?.();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Failed to unregister");
        } finally {
            setProcessing(false);
        }
    }

    return (
        <>
            {/* EVENTS TABLE */}
            <div className="bg-white border rounded-xl p-3 shadow-sm overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="text-left text-gray-600 border-b">
                            <th className="p-2">Title</th>
                            <th className="p-2">Schedule</th>
                            <th className="p-2">Capacity</th>
                            <th className="p-2">Price</th>
                            <th className="p-2 w-64">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((ev) => (
                            <tr
                                key={ev._id || ev.id}
                                className={`border-t transition ${
                                    ev.status === "cancelled"
                                        ? "bg-red-50 text-gray-500"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                <td className="p-2 font-medium">{ev.title || "Untitled"}</td>
                                <td className="p-2">
                                    {fmt(ev.startTime || ev.start)} –{" "}
                                    {fmt(ev.endTime || ev.end)}
                                </td>
                                <td className="p-2">
                                    {ev.claimedCount ?? 0} / {ev.maxSignups ?? 0}
                                </td>
                                <td className="p-2">
                                    {ev.priceType === "paid"
                                        ? `$${Number(ev.amount || 0).toFixed(2)}`
                                        : "Free"}
                                </td>
                                <td className="p-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelected(ev);
                                            setTab("details"); // reset tab each time
                                        }}
                                        disabled={ev.status === "cancelled"}
                                    >
                                        View Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">

                        {/* CLOSE BUTTON */}
                        <button
                            className="absolute top-3 right-4 text-gray-400 hover:text-black"
                            onClick={() => {
                                setSelected(null);
                                setConfirmUnreg(false);
                            }}
                        >
                            ✕
                        </button>

                        {/* TITLE */}
                        <h2 className="text-2xl font-semibold mb-4">
                            {selected.title}
                        </h2>

                        {/* TABS */}
                        <div className="flex border-b mb-4">
                            <button
                                className={`px-4 py-2 text-sm font-medium ${
                                    tab === "details"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600"
                                }`}
                                onClick={() => setTab("details")}
                            >
                                📄 Details
                            </button>

                            <button
                                className={`px-4 py-2 text-sm font-medium ${
                                    tab === "chat"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600"
                                }`}
                                onClick={() => setTab("chat")}
                            >
                                💬 Chat / Q&A
                            </button>
                        </div>

                        {/* TAB CONTENT */}
                        {tab === "details" && (
                            <div className="text-sm text-gray-700 space-y-2">
                                <p>
                                    <b>📅 Schedule:</b>{" "}
                                    {fmt(selected.startTime || selected.start)} –{" "}
                                    {fmt(selected.endTime || selected.end)}
                                </p>
                                <p>
                                    <b>📍 Location:</b>{" "}
                                    {selected.location || "Not specified"}
                                </p>
                                {selected.description && (
                                    <p>
                                        <b>📝 Description:</b> {selected.description}
                                    </p>
                                )}
                                <p>
                                    <b>🎟 Capacity:</b>{" "}
                                    {selected.claimedCount ?? 0} / {selected.maxSignups ?? 0}
                                </p>
                                <p>
                                    <b>💰 Price:</b>{" "}
                                    {selected.priceType === "paid"
                                        ? `$${Number(selected.amount || 0).toFixed(2)}`
                                        : "Free"}
                                </p>
                            </div>
                        )}

                        {tab === "chat" && (
                            <EventChat
                                eventId={selected._id || selected.id}
                                isOrganizer={false} // You can enable later
                            />
                        )}

                        {/* FOOTER BUTTONS */}
                        {!confirmUnreg ? (
                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setSelected(null)}>
                                    Close
                                </Button>
                                <Button
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => setConfirmUnreg(true)}
                                >
                                    Unregister
                                </Button>
                            </div>
                        ) : (
                            <div className="mt-6 border-t pt-4">
                                <p className="text-sm text-gray-700 mb-3">
                                    Are you sure you want to unregister from this event?
                                </p>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setConfirmUnreg(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        onClick={() => handleUnregister(selected)}
                                        disabled={processing}
                                    >
                                        {processing ? "Processing..." : "Confirm"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
