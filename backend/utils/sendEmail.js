// backend/utils/sendEmail.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
    }
}

export default sendEmail;
