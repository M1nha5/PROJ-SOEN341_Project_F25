import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const r = Router();

// Register
r.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ error: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        passwordHash,
        role: role || "student",
        status: role === "organizer" ? "pending" : undefined,
    });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

// Login (admin first)
r.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Hardcoded admin
    if (email === "admin@gmail.com" && password === "admin") {
        const token = jwt.sign({ id: "admin", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res
            .cookie("token", token, { httpOnly: true, sameSite: "lax" })
            .json({ name: "Admin", email, role: "admin" });
    }

    // Regular users
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    user.lastLoginAt = new Date();
    await user.save();

    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

// Logout
r.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ ok: true });
});

// Current user (/me)
r.get("/me", async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ error: "Not logged in" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === "admin")
            return res.json({ name: "Admin", email: "admin@gmail.com", role: "admin" });

        const user = await User.findById(decoded.id).select("name email role status");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

export default r;
