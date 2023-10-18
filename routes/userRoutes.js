const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

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

module.exports = router;
