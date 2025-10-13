// models/Ticket.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    userEmail: { type: String, required: true },
    qrCode: { type: String }, // base64 string of QR image
    claimedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
