import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

/**
 * POST /tickets/claim/:eventId
 * Student claims a ticket and receives confirmation email with QR + verify link
 */
r.post("/claim/:eventId", requireAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });
        if (event.claimedCount >= event.maxSignups)
            return res.status(400).json({ error: "Event full" });

        // Only students can claim
        if (req.user.role !== "student")
            return res.status(403).json({ error: "Only students can claim tickets" });

        // Prevent duplicate claims
        const existing = await Ticket.findOne({ user: req.user.id, event: event._id });
        if (existing)
            return res.status(400).json({ error: "You have already claimed this event" });

        // Generate QR ID and unified verify URL
        const qrId = uuidv4();
        const clientBase = process.env.CLIENT_URL || "http://localhost:3000";
        const qrUrl = `${clientBase.replace(/\/$/, "")}/ticket/verify/${qrId}`; // singular!

        // Create QR image encoding the same verify URL
        const qrImage = await QRCode.toDataURL(qrUrl);

        // Save ticket
        const ticket = await Ticket.create({
            user: req.user.id,
            event: event._id,
            qrCode: qrId,
            status: "claimed",
        });

        event.claimedCount++;
        await event.save();

        // Fetch user info for email
        const user = await User.findById(req.user.id).lean();
        if (!user || !user.email) {
            console.warn("⚠️ User missing email; skipping mail send.");
            return res.json({
                message: "Ticket claimed successfully (no email sent)",
                ticketId: ticket._id,
                qrUrl,
                qrImage,
            });
        }

        // Configure Gmail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Compose HTML email
        const mailOptions = {
            from: `"StudentEvent" <${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: `🎟️ Ticket Confirmation: ${event.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
                    <h2 style="color:#2563eb;">Hi ${user.name || "Student"},</h2>
                    <p>You have successfully registered for:</p>
                    <h3>${event.title}</h3>
                    <p><b>📍 Location:</b> ${event.location}</p>
                    <p><b>🕒 Start:</b> ${new Date(event.startTime).toLocaleString()}</p>
                    <p><b>🏁 End:</b> ${new Date(event.endTime).toLocaleString()}</p>
                    <p><b>🏷 Category:</b> ${event.category || "N/A"}</p>
                    <hr style="margin:16px 0;">
                    <p>Here’s your QR code — bring it to the event to check in:</p>
                    <img src="cid:qrimage" alt="QR Code" width="180"
                         style="border:1px solid #ccc; padding:8px; border-radius:8px;"/>
                    <p>
                        <a href="${qrUrl}" target="_blank"
                           style="display:inline-block;margin-top:10px;
                                  background:#2563eb;color:white;
                                  padding:10px 16px;border-radius:6px;
                                  text-decoration:none;">
                           View your ticket online
                        </a>
                    </p>
                    <hr style="margin:20px 0;">
                    <p>Thank you for registering! 🎉</p>
                    <p style="font-size:12px; color:#888;">© ${new Date().getFullYear()} StudentEvent</p>
                </div>
            `,
            attachments: [
                {
                    filename: "qrcode.png",
                    content: qrImage.split("base64,")[1],
                    encoding: "base64",
                    cid: "qrimage", // must match "cid:qrimage" above
                },
            ],
        };

        // Send email
        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Confirmation email sent to ${user.email}`);
        } catch (mailErr) {
            console.error("📧 Email send error:", mailErr.message);
        }

        // Response
        res.json({
            message: "Ticket claimed successfully and confirmation email sent!",
            ticketId: ticket._id,
            qrUrl,
            qrImage,
        });
    } catch (err) {
        console.error("❌ Ticket claim error:", err);
        res.status(500).json({ error: "Failed to claim ticket" });
    }
});

/**
 * DELETE /tickets/unclaim/:eventId
 * Student cancels their ticket
 */
r.delete("/unclaim/:eventId", requireAuth, async (req, res) => {
    try {
        const ticket = await Ticket.findOneAndDelete({
            user: req.user.id,
            event: req.params.eventId,
        });
        if (!ticket) return res.status(404).json({ error: "No ticket found" });

        await Event.findByIdAndUpdate(req.params.eventId, { $inc: { claimedCount: -1 } });
        res.json({ message: "Ticket unclaimed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to unclaim ticket" });
    }
});

/**
 * GET /tickets/my
 * Fetch all tickets claimed by the current user
 */
r.get("/my", requireAuth, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id })
            .populate("event", "title startTime endTime location category maxSignups claimedCount priceType amount description");
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load tickets" });
    }
});

/**
 * GET /ticket/verify/:id
 * Verify ticket validity (for both organizers & students)
 */
r.get("/verify/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ qrCode: req.params.id })
            .populate("event")
            .populate("user", "name email");

        if (!ticket)
            return res.status(404).json({ valid: false, message: "Invalid or expired ticket" });

        res.json({
            valid: true,
            status: ticket.status,
            event: ticket.event,
            user: ticket.user,
            checkedInAt: ticket.checkedInAt,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ valid: false, message: "Server error" });
    }
});

export default r;
