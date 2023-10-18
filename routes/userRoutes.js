const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res
            .status(401)
            .json({ message: "No token, authorization denied." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid." });
    }
};

// User Registration Endpoint
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the username or email already exists
        const userExists = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (userExists) {
            return res
                .status(400)
                .json({ message: "Username or email already exists." });
        }

        // Create a new user
        const user = new User({
            username,
            email,
            password,
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error. Please try again later.",
        });
    }
});

// User Login Endpoint
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid username or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Invalid username or password." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token, userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error. Please try again later.",
        });
    }
});

// Get User Profile
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Update Highest Score
router.put("/updateScore", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (req.body.score > user.highestScore) {
            user.highestScore = req.body.score;
            await user.save();
            res.json({ message: "Score updated successfully." });
        } else {
            res.json({
                message: "Score is not higher than the current highest score.",
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
