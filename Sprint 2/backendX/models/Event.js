// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title:        { type: String, required: true },
    description:  { type: String, required: true },
    date:         { type: Date,   required: true },
    duration:     { type: Number, required: true }, // ✅ duration in minutes
    category:     { type: String },
    organization: { type: String },
    capacity:     { type: Number, default: 0 },
    ticketType:   { type: String, enum: ["free", "paid"], default: "free" },
});

module.exports = mongoose.model("Event", eventSchema);
