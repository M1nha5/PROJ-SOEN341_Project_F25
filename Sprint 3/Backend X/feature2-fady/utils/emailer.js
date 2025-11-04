import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"No Reply" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent:", info.messageId);
        return info;
    } catch (err) {
        console.error("Email sending failed:", err);
        throw err;
    }
}

export async function scheduleEmail({ to, subject, html, seconds }) {

    if (!seconds || seconds <= 0) {
        console.log(`Skipping email to ${to} (delay is ${seconds}s)`);
        return;
    }

    console.log(`Scheduled email to ${to} in ${seconds}s`);

    await new Promise(resolve => setTimeout(resolve, seconds * 1000));

    return sendEmail({ to, subject, html });
}

