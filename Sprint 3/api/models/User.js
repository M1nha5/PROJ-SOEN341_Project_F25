import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    // student | organizer | admin
    role: { type: String, enum: ["student", "organizer", "admin"], default: "student" },

    // only for organizers
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
