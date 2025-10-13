// controllers/eventController.js

const Event = require("../models/Event");

// ------------------------------------------------------------
// GET /api/events
// Fetch all events with optional filters (category, organization, date)
// ------------------------------------------------------------
const getAllEvents = async (req, res) => {
    try {
        const filters = {};
        const { category, organization, date } = req.query;

        if (category) filters.category = category;
        if (organization) filters.organization = organization;
        if (date) filters.date = { $gte: new Date(date) };

        const events = await Event.find(filters);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }
};

// ------------------------------------------------------------
// POST /api/events
// Create a new event (organizer only, mock for now)
// ------------------------------------------------------------
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            duration,
            category,
            organization,
            capacity,
            ticketType,
        } = req.body;

        // Validate required fields
        if (!title || !description || !date || !duration) {
            return res.status(400).json({
                message: "Title, description, date, and duration are required",
            });
        }

        // Create new event
        const event = await Event.create({
            title,
            description,
            date,
            duration,
            category,
            organization,
            capacity,
            ticketType,
        });

        res.status(201).json({ message: "Event created", event });
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error });
    }
};

// ------------------------------------------------------------
// Export all controller functions
// ------------------------------------------------------------
module.exports = {
    getAllEvents,
    createEvent,
};
