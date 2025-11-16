import { Router } from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import { Parser } from "json2csv";
import { requireAuth } from "../middleware/auth.js";
import nodemailer from "nodemailer";

const r = Router();

/**
 * GET /events
 * Public list with optional filters: q, category, orgId, from, to
 */
r.get("/", async (req, res) => {
    console.log("🟦 /events called");

    const { q, category, orgId, from, to } = req.query;
    const filter = {};

    if (q) filter.title = { $regex: q, $options: "i" };
    if (category) filter.category = category;
    if (orgId) filter.organization = orgId;
    if (from || to) {
        filter.startTime = {
            ...(from ? { $gte: new Date(from) } : {}),
            ...(to ? { $lte: new Date(to) } : {}),
        };
    }

    const events = await Event.find(filter).sort({ startTime: 1 }).limit(100);

    console.log("🟩 EVENTS FOUND:", events.length);
    console.log(events);

    res.json(events);
});


/**
 * GET /events/:id
 * Public: event details
 */
r.get("/:id", async (req, res) => {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    res.json(ev);
});

/**
 * POST /events
 * Organizer only (must be approved)
 */
r.post("/", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("role status");
        if (!user) return res.status(401).json({ error: "Unauthorized" });
        if (user.role !== "organizer")
            return res.status(403).json({ error: "Organizer only" });
        if (user.status !== "approved")
            return res
                .status(403)
                .json({ error: "Organizer not approved by admin" });

        let {
            title,
            description,
            location,
            startTime,
            endTime,
            maxSignups,
            priceType = "free",
            amount = 0,
            category,
        } = req.body;

        if (!title || !location || !startTime || !endTime)
            return res.status(400).json({ error: "Missing required fields" });

        const start = new Date(startTime);
        const end = new Date(endTime);
        if (isNaN(start) || isNaN(end))
            return res.status(400).json({ error: "Invalid date format" });
        if (start >= end)
            return res
                .status(400)
                .json({ error: "Start time must be before end time" });

        maxSignups = parseInt(maxSignups, 10);
        if (isNaN(maxSignups) || maxSignups <= 0) maxSignups = 100;

        amount = parseFloat(amount) || 0;
        if (priceType === "paid" && amount <= 0)
            return res
                .status(400)
                .json({ error: "Amount must be greater than 0 for paid events" });

        const ev = await Event.create({
            title,
            description,
            location,
            startTime: start,
            endTime: end,
            maxSignups,
            priceType,
            amount: priceType === "paid" ? amount : 0,
            category,
            organization: req.user.id,
            status: "active",
            claimedCount: 0,
        });

        res.status(201).json(ev);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create event" });
    }
});

/**
 * GET /events/:id/attendees/export
 * Organizer CSV export
 */
r.get("/:id/attendees/export", async (req, res) => {
    try {
        const eventId = req.params.id;
        const tickets = await Ticket.find({ event: eventId })
            .populate("user", "name email")
            .lean();

        if (!tickets.length)
            return res.status(404).json({ error: "No attendees found" });

        const data = tickets.map((t) => ({
            name: t.user?.name || "",
            email: t.user?.email || "",
            status: t.status,
            checkedInAt: t.checkedInAt
                ? new Date(t.checkedInAt).toLocaleString()
                : "",
        }));

        const parser = new Parser({
            fields: ["name", "email", "status", "checkedInAt"],
        });
        const csv = parser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment(`attendees_${eventId}.csv`);
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to export attendees" });
    }
});

/**
 * GET /events/:id/attendees
 * Organizer view all registered students
 */
r.get("/:id/attendees", requireAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (
            req.user.role !== "admin" &&
            req.user.id.toString() !== event.organization.toString()
        ) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const tickets = await Ticket.find({ event: event._id })
            .populate("user", "name email")
            .lean();

        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch attendees" });
    }
});

/**
 * PATCH /events/:id/cancel
 * Organizer/Admin cancels an event with reason + email notifications
 */
r.patch("/:id/cancel", requireAuth, async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason) return res.status(400).json({ error: "Reason is required" });

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.status === "cancelled")
            return res.status(400).json({ error: "Event already cancelled" });

        if (req.user.role !== "organizer" && req.user.role !== "admin")
            return res.status(403).json({ error: "Unauthorized" });

        event.status = "cancelled";
        event.cancelReason = reason;
        event.cancelledAt = new Date();
        await event.save();

        const tickets = await Ticket.find({ event: event._id }).populate("user");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await Promise.all(
            tickets.map(async (t) => {
                const u = t.user;
                if (!u?.email) return;
                try {
                    await transporter.sendMail({
                        from: process.env.GMAIL_USER,
                        to: u.email,
                        subject: `Event Cancelled: ${event.title}`,
                        text: `Dear ${u.name || "student"},\n\nThe event "${event.title}" has been cancelled.\nReason: ${reason}\nLocation: ${event.location}\nTime: ${new Date(
                            event.startTime
                        ).toLocaleString()}\n\nWe apologize for the inconvenience.\n\n— StudentEvent Team`,
                    });
                } catch (mailErr) {
                    console.error("Email failed for", u.email, mailErr.message);
                }
            })
        );

        res.json({ message: "Event cancelled and attendees notified." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to cancel event" });
    }
});

/**
 * DELETE /events/:eventId/attendees/:userId
 * Organizer manually removes a student from their event
 */
r.delete("/:eventId/attendees/:userId", requireAuth, async (req, res) => {
    try {
        const { eventId, userId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (
            req.user.role !== "admin" &&
            req.user.id.toString() !== event.organization.toString()
        ) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const ticket = await Ticket.findOneAndDelete({ user: userId, event: eventId });
        if (!ticket)
            return res
                .status(404)
                .json({ error: "User not registered for this event" });

        await Event.findByIdAndUpdate(eventId, { $inc: { claimedCount: -1 } });

        res.json({ message: "Student unregistered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to unregister student" });
    }
});

export default r;
