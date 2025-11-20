import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    qrCode: { type: String, required: true }, // uuid we email as QR
    status: { type: String, enum: ["claimed", "checked_in", "cancelled"], default: "claimed" },
    claimedAt: { type: Date, default: Date.now },
    checkedInAt: { type: Date } // set when organizer scans
}, { timestamps: true });

TicketSchema.index({ user: 1, event: 1 }, { unique: true }); // 1 ticket per user/event

export default mongoose.model("Ticket", TicketSchema);
