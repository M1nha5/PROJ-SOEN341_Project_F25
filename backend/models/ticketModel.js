// backend/models/ticketModel.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  userId: { type: String, required: true },
  claimDate: { type: Date, default: Date.now },
  status: { type: String, default: "claimed" },
  qrCode: { type: String } // we'll generate this later
});

export default mongoose.model("Ticket", ticketSchema);
