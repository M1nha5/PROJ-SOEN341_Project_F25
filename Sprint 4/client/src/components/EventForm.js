import React, { useState } from "react";
import api from "../api";
import { toast } from "sonner";

const init = {
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    maxSignups: 50,
    priceType: "free",
    amount: 0,
    category: "",
};

export default function EventForm({ onCreated }) {
    const [form, setForm] = useState(init);
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({
            ...s,
            [name]:
                name === "maxSignups" || name === "amount"
                    ? value === "" ? "" : Number(value)
                    : value,
        }));
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.startTime || !form.endTime) {
            toast.info("Please fill in title, start, and end time.");
            return;
        }

        try {
            setLoading(true);
            const payload = { ...form };

            // ensure valid ISO date strings
            const start = new Date(form.startTime);
            const end = new Date(form.endTime);
            if (isNaN(start) || isNaN(end)) {
                toast.error("Invalid start or end time");
                return;
            }

            payload.startTime = start.toISOString();
            payload.endTime = end.toISOString();

            if (!payload.maxSignups || payload.maxSignups <= 0) {
                payload.maxSignups = 100;
            }

            if (payload.priceType !== "paid") payload.amount = 0;

            const { data } = await api.post("/events", payload);
            toast.success("✅ Event created successfully!");
            setForm(init);
            onCreated?.(data);
        } catch (err) {
            const msg =
                err?.response?.data?.error || "❌ Could not create event. Try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-3 bg-white border rounded-xl p-5 shadow-sm"
        >
            <h2 className="text-lg font-semibold">Create Event</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm mb-1">Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        className="w-full rounded-lg border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Category</label>
                    <input
                        name="category"
                        value={form.category}
                        onChange={onChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Location</label>
                    <input
                        name="location"
                        value={form.location}
                        onChange={onChange}
                        className="w-full rounded-lg border px-3 py-2"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        className="w-full rounded-lg border px-3 py-2"
                        rows="3"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Start</label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={form.startTime}
                        onChange={onChange}
                        className="w-full rounded-lg border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">End</label>
                    <input
                        type="datetime-local"
                        name="endTime"
                        value={form.endTime}
                        onChange={onChange}
                        className="w-full rounded-lg border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Max Signups</label>
                    <input
                        type="number"
                        min="1"
                        name="maxSignups"
                        value={form.maxSignups}
                        onChange={onChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm mb-1">Ticket Type</label>
                        <select
                            name="priceType"
                            value={form.priceType}
                            onChange={onChange}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="free">Free</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="amount"
                            value={form.amount}
                            onChange={onChange}
                            className="w-full rounded-lg border px-3 py-2"
                            disabled={form.priceType !== "paid"}
                        />
                    </div>
                </div>
            </div>

            <button
                className="w-full md:w-auto rounded-lg bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 disabled:opacity-60"
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Event"}
            </button>
        </form>
    );
}
