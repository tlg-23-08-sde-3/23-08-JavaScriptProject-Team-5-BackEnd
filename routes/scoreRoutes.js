const express = require("express");
const router = express.Router();
const Score = require("../models/score");

// Endpoint to save a new score
router.post("/save", async (req, res) => {
    // Extract score details from the request body
    const { username, score, difficulty, time } = req.body;

    try {
        // Create a new score instance using the provided details
        const newScore = new Score({
            username,
            score,
            difficulty,
            time,
        });

        // Save the score instance to the database
        await newScore.save();

        // Send a success response
        res.status(201).json({ message: "Score saved successfully." });
    } catch (error) {
        // Handle any errors during the save process
        console.error(error);
        res.status(500).json({
            message: "Error saving the score.",
        });
    }
});

// Endpoint to fetch all scores
router.get("/all", async (req, res) => {
    try {
        // Fetch all scores from the database and sort them in descending order based on the score value
        const scores = await Score.find().sort({ score: -1 });

        // Send the fetched scores in the response
        res.json(scores);
    } catch (error) {
        // Handle any errors during the fetch process
        console.error(error);
        res.status(500).json({
            message: "Error fetching scores.",
        });
    }
});

module.exports = router;
