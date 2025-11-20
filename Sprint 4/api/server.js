import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import adminRoutes from "./routes/admin.js";
import ticketRoutes from "./routes/tickets.js";
import scanRoutes from "./routes/scan.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/admin", adminRoutes);
app.use("/tickets", ticketRoutes);
app.use("/scan", scanRoutes);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`🚀 API running on :${PORT}`)))
    .catch(err => {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    });
