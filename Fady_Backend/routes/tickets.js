const express = require("express");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Load events to validate eventId existence
const eventsPath = path.join(__dirname, "..", "data", "events.json");
let events = [];
try {
  events = JSON.parse(fs.readFileSync(eventsPath, "utf8"));
} catch (err) {
  events = [];
}

/**
 * In-memory ticket store:
 * { [ticketId]: { ticketId, userId, eventId, ticketType, issuedAt, qrData } }
 */
const tickets = {};

/**
 * POST /tickets/claim
 * Body: { userId: string, eventId: string, ticketType?: "free"|"paid" }
 *
 * Returns: { ticketId, eventId, qrDataUrl }
 */
router.post("/claim", async (req, res) => {
  try {
    const { userId, eventId, ticketType = "free" } = req.body;
    if (!userId || !eventId) {
      return res.status(400).json({ error: "userId and eventId are required" });
    }

    // Verify event exists (simple)
    const event = events.find((e) => e.id === eventId);
    if (!event) return res.status(400).json({ error: "Invalid eventId" });

    // Create ticket payload
    const ticketId = uuidv4();
    const issuedAt = new Date().toISOString();

    // Ticket data encoded in QR (you can change format later)
    const qrPayload = {
      ticketId,
      userId,
      eventId,
      ticketType,
      issuedAt
    };

    // Generate QR code as Data URL (PNG)
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));

    const ticket = {
      ticketId,
      userId,
      eventId,
      ticketType,
      issuedAt,
      qrDataUrl
    };

    tickets[ticketId] = ticket;

    return res.status(201).json({
      ticketId,
      eventId,
      issuedAt,
      qrDataUrl
    });
  } catch (err) {
    console.error("POST /tickets/claim error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /tickets/:ticketId
 */
router.get("/:ticketId", (req, res) => {
  const ticketId = req.params.ticketId;
  const ticket = tickets[ticketId];
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
});

module.exports = router;
