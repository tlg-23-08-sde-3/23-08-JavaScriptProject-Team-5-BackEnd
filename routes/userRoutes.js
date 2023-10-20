const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    // Retrieve token from request header
    const token = req.header("x-auth-token");

    // If no token is provided, return an unauthorized error
    if (!token) {
        return res
            .status(401)
            .json({ message: "No token, authorization denied." });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // If token verification fails, return an error
        res.status(401).json({ message: "Token is not valid." });
    }
};

// User Registration Endpoint
router.post("/register", async (req, res) => {
    // Extract user details from the request body
    const { username, email, password } = req.body;

    try {
        // Check if a user with the provided username or email already exists
        const userExists = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (userExists) {
            return res
                .status(400)
                .json({ message: "Username or email already exists." });
        }

        // If not, create a new user instance
        const user = new User({
            username,
            email,
            password,
        });

        // Save the new user to the database
        await user.save();

        // Return a success response
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        // Handle any errors during the registration process
        console.error(error);
        res.status(500).json({
            message: "userRoutes post-register error.",
        });
    }
});

// User Login Endpoint
router.post("/login", async (req, res) => {
    // Extract login details from the request body
    const { username, password } = req.body;

    try {
        // Check if the provided username exists in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username." });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }

        // If login is successful, generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Return the generated token and user ID in the response
        res.json({ token, userId: user._id });
    } catch (error) {
        // Handle any errors during the login process
        console.error(error);
        res.status(500).json({
            message: "userRoutes post-login error.",
        });
    }
});

// Get User Profile Endpoint
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        // Fetch user details from the database, excluding the password
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        // Handle any errors during the profile fetch process
        console.error(err.message);
        res.status(500).send("userRoutes get-profile error");
    }
});

// Update Highest Score Endpoint
router.put("/updateScore", authenticateToken, async (req, res) => {
    try {
        // Fetch the user's current highest score from the database
        const user = await User.findById(req.user.id);

        // Check if the provided score is higher than the current highest score
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
        // Handle any errors during the score update process
        console.error(err.message);
        res.status(500).send("userRoutes put-updateScore error");
    }
});

// Check User Session Endpoint
router.get("/checkSession", authenticateToken, async (req, res) => {
    try {
        // Fetch the username of the authenticated user from the database
        const user = await User.findById(req.user.id).select("username");
        if (user) {
            res.json({
                userToken: req.header("x-auth-token"),
                userId: req.user.id,
                username: user.username,
            });
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (err) {
        // Handle any errors during the session check process
        console.error(err.message);
        res.status(500).send("userRoutes get-checkSession error");
    }
});

module.exports = router;
