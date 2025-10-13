// controllers/authController.js
const User = require("../models/User");

// POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, role } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, role });
        res.status(201).json({ message: "User registered", user });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

// POST /api/auth/login  (mock)
const loginUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // No password/token, just return user info
        res.json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};

module.exports = { registerUser, loginUser };
