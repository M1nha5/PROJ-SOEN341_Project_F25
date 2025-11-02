import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Add this route
app.get("/", (req, res) => {
  res.send("✅ Organizer Backend is running successfully!");
});

// Start server
const PORT = process.env.PORT || 5001;
app.use("/api/events", eventRoutes);
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
