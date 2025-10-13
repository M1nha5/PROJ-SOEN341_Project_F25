// routes/ticketRoutes.js
const express = require("express");
const router = express.Router();
const { claimTicket, getTicketsByUser } = require("../controllers/ticketController");

// claim a ticket
router.post("/claim", claimTicket);

// get all tickets for a specific user
router.get("/:email", getTicketsByUser);

module.exports = router;
