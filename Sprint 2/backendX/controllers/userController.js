// backend/controllers/userController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role });
        res.status(201).json({ message: "User registered", user: { id: user._id, name, email, role } });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err });
    }
};

// POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: "Invalid password" });

        res.json({
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err });
    }
};

module.exports = { registerUser, loginUser };
