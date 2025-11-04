// controllers/ticketController.js
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const generateQR = require("../utils/generateQR");



// POST /api/tickets/claim
const claimTicket = async (req, res) => {
    try {
        const { eventId, userEmail } = req.body;

        // validate
        if (!eventId || !userEmail)
            return res.status(400).json({ message: "Event ID and user email required" });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // prevent duplicate ticket
        const existing = await Ticket.findOne({ eventId, userEmail });
        if (existing)
            return res.status(400).json({ message: "Ticket already claimed for this event" });

        // generate unique QR text (for now: eventId + email + timestamp)
        const qrText = `${eventId}-${userEmail}-${Date.now()}`;
        const qrCode = await generateQR(qrText);

        const ticket = await Ticket.create({ eventId, userEmail, qrCode });

        res.status(201).json({
            message: "Ticket claimed successfully",
            ticket,
        });
    } catch (error) {
        res.status(500).json({ message: "Error claiming ticket", error });
    }
};

// GET /api/tickets/:email  -> get all tickets for a user
const getTicketsByUser = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const tickets = await Ticket.find({ userEmail }).populate("eventId", "title date");
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tickets", error });
    }
};

module.exports = { claimTicket, getTicketsByUser };
