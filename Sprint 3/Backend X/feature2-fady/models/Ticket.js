import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  attendeeName: String,
  attendeeEmail: String,
  qrCode: String, // store QR code path or string
  validated: { type: Boolean, default: false },
});

export default mongoose.model("Ticket", ticketSchema);
