import { Router } from "express";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

const r = Router();

/**
 * GET /scan/:qrCode
 * Validate a QR code and show ticket + event status
 */
r.get("/:qrCode", async (req, res) => {
    const qrCode = req.params.qrCode;

    // find ticket by QR code
    const ticket = await Ticket.findOne({ qrCode }).populate("event user");
    if (!ticket) return res.status(404).json({ error: "Invalid or unknown ticket" });

    const event = await Event.findById(ticket.event);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const now = new Date();
    let status = "inactive";

    if (now < event.startTime) status = "not_started";
    else if (now > event.endTime) status = "expired";
    else {
        // within valid event window
        status = "active";

        // mark attendance if not already
        if (ticket.status !== "checked_in") {
            ticket.status = "checked_in";
            ticket.checkedInAt = new Date();
            await ticket.save();
        }
    }

    res.json({
        status,
        ticketId: ticket._id,
        user: {
            name: ticket.user.name,
            email: ticket.user.email
        },
        event: {
            title: event.title,
            description: event.description,
            location: event.location,
            category: event.category,
            startTime: event.startTime,
            endTime: event.endTime,
            claimedCount: event.claimedCount,
            maxSignups: event.maxSignups
        },
        checkedInAt: ticket.checkedInAt
    });
});

export default r;
