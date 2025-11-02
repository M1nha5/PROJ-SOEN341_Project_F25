import express from "express";
import Event from "../models/Event.js";
import multer from "multer";
import { Parser } from "json2csv";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 🟢 GET all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔵 GET a single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟣 POST create a new event
router.post("/create", async (req, res) => {
  try {
    const { title, description, date, location, capacity, ticketType } = req.body;
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      capacity,
      ticketType,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📊 GET event analytics (tickets issued, attendance rate, remaining capacity)
router.get("/:id/analytics", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const ticketsIssued = event.attendees.length;
    const attendeesPresent = event.attendees.filter(a => a.checkedIn).length;
    const attendanceRate = event.capacity
      ? ((attendeesPresent / event.capacity) * 100).toFixed(2)
      : 0;
    const remainingCapacity = event.capacity - ticketsIssued;

    res.json({
      eventId: event._id,
      title: event.title,
      ticketsIssued,
      attendeesPresent,
      attendanceRate: `${attendanceRate}%`,
      remainingCapacity,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🧾 Export attendee list to CSV
router.get("/:id/export", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const csvFields = ["name", "email", "checkedIn"];
    const parser = new Parser({ fields: csvFields });
    const csv = parser.parse(event.attendees);

    res.header("Content-Type", "text/csv");
    res.attachment(`${event.title}_attendees.csv`);
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🎟️ Validate QR code (simulated by image upload)
router.post("/:id/validate-ticket", upload.single("qrImage"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // For simplicity, we simulate decoding QR to attendee email
    const fakeEmail = "john.doe@example.com";

    const attendee = event.attendees.find(a => a.email === fakeEmail);
    if (!attendee) return res.status(404).json({ message: "Ticket not found" });

    attendee.checkedIn = true;
    await event.save();

    res.json({ message: `✅ Ticket validated for ${attendee.name}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
