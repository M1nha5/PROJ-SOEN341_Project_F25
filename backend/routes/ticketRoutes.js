// backend/routes/ticketRoutes.js
import express from "express";
import { claimTicket } from "../controllers/ticketController.js";

const router = express.Router();

// Route: POST /api/tickets/claim
router.post("/claim", claimTicket);

export default router;
