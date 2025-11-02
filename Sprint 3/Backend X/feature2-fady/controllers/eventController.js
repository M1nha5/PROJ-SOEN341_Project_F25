import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";
import { generateCSV } from "../utils/exportCSV.js";
import { validateQRCode } from "../utils/qrValidator.js";

// ✅ Create Event
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📊 Event Analytics
export const getEventAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate("attendees");

    if (!event) return res.status(404).json({ message: "Event not found" });

    const total = event.capacity;
    const issued = event.ticketsIssued;
    const attendanceRate = total ? ((issued / total) * 100).toFixed(2) : 0;

    res.json({
      eventId: event._id,
      title: event.title,
      ticketsIssued: issued,
      attendanceRate,
      remaining: total - issued,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📤 Export Attendees CSV
export const exportAttendeesCSV = async (req, res) => {
  try {
    const { id } = req.params;
    const tickets = await Ticket.find({ eventId: id });

    const csv = generateCSV(tickets);
    res.header("Content-Type", "text/csv");
    res.attachment("attendees.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Validate QR code (simulated)
export const validateQR = async (req, res) => {
  try {
    const qrFile = req.file;
    if (!qrFile) return res.status(400).json({ message: "No QR file uploaded" });

    const ticketId = await validateQRCode(qrFile.path);
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) return res.status(404).json({ message: "Invalid ticket" });

    ticket.validated = true;
    await ticket.save();

    res.json({ message: "QR code validated", ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
