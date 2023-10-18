const express = require("express");
const router = express.Router();
const Score = require("../models/score");

// Endpoint to save a new score
router.post("/save", async (req, res) => {
    const { username, score, difficulty, time } = req.body;

    try {
        const newScore = new Score({
            username,
            score,
            difficulty,
            time,
        });

        await newScore.save();

        res.status(201).json({ message: "Score saved successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error saving the score.",
        });
    }
});

// Endpoint to fetch all scores
router.get("/all", async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 });
        res.json(scores);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching scores.",
        });
    }
});

module.exports = router;
