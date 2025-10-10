const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

/**
 * In-memory store for user calendars.
 * Format: { [userId]: [{ savedId, eventId, savedAt, note }] }
 */
const userCalendars = {};

/**
 * POST /calendar/:userId/save
 * Body: { eventId: string, note?: string }
 * Adds eventId to user calendar.
 */
router.post("/:userId/save", (req, res) => {
  try {
    const userId = String(req.params.userId);
    const { eventId, note } = req.body;
    if (!eventId) return res.status(400).json({ error: "eventId is required" });

    if (!userCalendars[userId]) userCalendars[userId] = [];

    // avoid duplicates — simple check
    const exists = userCalendars[userId].some((s) => s.eventId === eventId);
    if (exists) {
      return res.status(200).json({ message: "Event already saved", saved: true });
    }

    const saved = {
      savedId: uuidv4(),
      eventId,
      savedAt: new Date().toISOString(),
      note: note || ""
    };
    userCalendars[userId].push(saved);
    return res.status(201).json({ saved });
  } catch (err) {
    console.error("POST /calendar/:userId/save error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /calendar/:userId
 * Returns saved events (IDs only, frontend can join with /events).
 */
router.get("/:userId", (req, res) => {
  const userId = String(req.params.userId);
  const saved = userCalendars[userId] || [];
  return res.json({ count: saved.length, saved });
});

module.exports = router;
