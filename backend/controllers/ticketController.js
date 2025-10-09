// backend/controllers/ticketController.js
import Ticket from "../models/ticketModel.js";
import QRCode from "qrcode";
import sendEmail from "../utils/sendEmail.js";


export const claimTicket = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // Validate required fields
    if (!eventId || !userId) {
      return res.status(400).json({ error: "Missing eventId or userId" });
    }

    // Prevent duplicate claims by same user for same event
    const existing = await Ticket.findOne({ eventId, userId });
    if (existing) {
      return res.status(400).json({ error: "Ticket already claimed" });
    }

    // Create new ticket
    const ticket = new Ticket({ eventId, userId });

    // Generate QR code containing essential data
    const qrData = JSON.stringify({
      ticketId: ticket._id,
      eventId,
      userId,
    });

    // Convert data to Base64 QR image
    ticket.qrCode = await QRCode.toDataURL(qrData);

    // Save ticket to MongoDB
    await ticket.save();

    // Respond with ticket info (including QR)
    res.status(201).json({
      message: "🎟️ Ticket successfully claimed",
      ticket,
    });


    await sendEmail(userId,
        `Ticket for event Claimed Successfully`,
        `Ticket for event ${eventId} has been successfully claimed!` //will include the event time, recommendations and instructions...
    );

  } catch (err) {
    console.error("Claim Ticket Error:", err.message);
    res.status(500).json({ error: err.message });

  }

};