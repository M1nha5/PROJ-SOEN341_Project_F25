const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Path to your JSON data file
const eventsPath = path.join(__dirname, "..", "data", "events.json");

// Load events from JSON file into memory
let events = [];
try {
  if (fs.existsSync(eventsPath)) {
    const raw = fs.readFileSync(eventsPath, "utf8");
    events = JSON.parse(raw);
    console.log(`Loaded ${events.length} events from events.json`);
  } else {
    console.warn("⚠️ events.json file not found — using empty list.");
  }
} catch (err) {
  console.error("❌ Failed to load events.json:", err.message);
  events = [];
}

/**
 * GET /api/events
 * Optional query parameters:
 *  - q: keyword (search title or organization)
 *  - category: event category
 *  - organization: filter by organization
 *  - dateFrom, dateTo: filter by date range (YYYY-MM-DD)
 */
router.get("/", (req, res) => {
  try {
    const { q, category, organization, dateFrom, dateTo } = req.query;

    const filtered = events.filter((event) => {
      // Keyword search
      if (q && q.trim()) {
        const query = q.trim().toLowerCase();
        if (
          !event.title.toLowerCase().includes(query) &&
          !event.organization.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Category filter
      if (category && category !== "all" && event.category !== category) {
        return false;
      }

      // Organization filter
      if (organization && organization !== "all" && event.organization !== organization) {
        return false;
      }

      // Date filters
      const evDate = new Date(event.date);
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (evDate < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (evDate > to) return false;
      }

      return true;
    });

    res.status(200).json({
      count: filtered.length,
      events: filtered,
    });
  } catch (err) {
    console.error("GET /api/events error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/events/:id
 * Fetch a single event by ID
 */
router.get("/:id", (req, res) => {
  const id = req.params.id; // keep it as a string
  const event = events.find((e) => e.id === id);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.status(200).json(event);
});

module.exports = router;
