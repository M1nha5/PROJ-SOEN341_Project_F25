import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";

const r = Router();

/**
 * Middleware to ensure user is admin
 */
function requireAdmin(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        const bearer = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
        const token = bearer || req.cookies?.token;
        if (!token) return res.status(401).json({ error: "Not logged in" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") return res.status(403).json({ error: "Admin only" });

        req.user = decoded;
        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        res.status(401).json({ error: "Invalid token" });
    }
}

/**
 * GET /admin/organizers/pending
 * List all pending organizers
 */
r.get("/organizers/pending", requireAdmin, async (_req, res) => {
    try {
        const users = await User.find({ role: "organizer", status: "pending" }).select("name email status");
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load organizers" });
    }
});

/**
 * PATCH /admin/organizers/:id/approve
 * Approve an organizer
 */
r.patch("/organizers/:id/approve", requireAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ ok: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to approve organizer" });
    }
});

/**
 * PATCH /admin/organizers/:id/reject
 * Reject an organizer
 */
r.patch("/organizers/:id/reject", requireAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ ok: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to reject organizer" });
    }
});

/**
 * GET /admin/events
 * Admin view — all events
 */
r.get("/events", requireAdmin, async (req, res) => {
    try {
        const events = await Event.find()
            .populate("organization", "name email")
            .sort({ startTime: -1 })
            .lean();

        res.json(events);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ error: "Failed to load events" });
    }
});

/**
 * GET /admin/analytics
 * Returns total counts for events, tickets, users
 */
r.get("/analytics", requireAdmin, async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalTickets = await Ticket.countDocuments();
        const totalUsers = await User.countDocuments();
        const activeEvents = await Event.countDocuments({ status: "active" });
        const cancelledEvents = await Event.countDocuments({ status: "cancelled" });

        res.json({
            totalEvents,
            totalTickets,
            totalUsers,
            activeEvents,
            cancelledEvents,
        });
    } catch (err) {
        console.error("Error fetching analytics:", err);
        res.status(500).json({ error: "Failed to load analytics" });
    }
});

r.get("/analytics", requireAdmin, async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalTickets = await Ticket.countDocuments();
        const totalUsers = await User.countDocuments();
        const activeEvents = await Event.countDocuments({ status: "active" });
        const cancelledEvents = await Event.countDocuments({ status: "cancelled" });

        // Group tickets by month for chart
        const monthlyTickets = await Ticket.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } },
        ]);

        // Format months for chart readability
        const monthLabels = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const ticketTrends = monthlyTickets.map((m) => ({
            month: monthLabels[m._id - 1],
            count: m.count,
        }));

        res.json({
            totalEvents,
            totalTickets,
            totalUsers,
            activeEvents,
            cancelledEvents,
            ticketTrends,
        });
    } catch (err) {
        console.error("Error fetching analytics:", err);
        res.status(500).json({ error: "Failed to load analytics" });
    }
});


export default r;
