// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const { getAllEvents, createEvent } = require("../controllers/eventController");

// student: browse/search
router.get("/", getAllEvents);

// organizer: create
router.post("/", createEvent);

module.exports = router;
