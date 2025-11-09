import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    maxSignups: { type: Number, required: true },
    priceType: { type: String, enum: ["free", "paid"], default: "free" },
    amount: { type: Number, default: 0 },
    category: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "cancelled", "completed"], default: "active" },
    claimedCount: { type: Number, default: 0 },
    cancelReason: { type: String }

}, { timestamps: true });

// Auto virtual for duration
EventSchema.virtual("duration").get(function () {
    if (!this.startTime || !this.endTime) return null;
    return Math.round((this.endTime - this.startTime) / (1000 * 60)); // minutes
});

export default mongoose.model("Event", EventSchema);
