// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ticketRoutes from "./routes/ticketRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (for now we'll assume local)
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/events", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Use ticket routes
app.use("/api/tickets", ticketRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
