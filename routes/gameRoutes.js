const express = require("express");
const router = express.Router();
const Game = require("../models/game");

router.post("/save", async (req, res) => {
    try {
        const { userId, remainingTime, flippedCards, cardOrder, difficulty } =
            req.body;

        // Check if a game state already exists for this user
        let gameState = await Game.findOne({ userId });
        if (gameState) {
            // Update existing game state
            gameState.remainingTime = remainingTime;
            gameState.flippedCards = flippedCards;
            gameState.cardOrder = cardOrder.map((card) => ({
                imageIndex: card.imageIndex,
                imageUrl: card.imageUrl,
            }));
            gameState.difficulty = difficulty;
        } else {
            // Create a new game state
            gameState = new Game({
                userId,
                remainingTime,
                flippedCards,
                cardOrder: cardOrder.map((card) => ({
                    imageIndex: card.imageIndex,
                    imageUrl: card.imageUrl,
                })),
                difficulty,
            });
        }

        await gameState.save();
        res.json({ success: true });
    } catch (error) {
        console.error(error); // Log the actual error
        res.status(500).json({ error: "Failed to save game state" });
    }
});

router.get("/load/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const gameState = await Game.findOne({ userId });
        if (!gameState) {
            return res.status(404).json({ error: "Game state not found" });
        }
        res.json(gameState);
    } catch (error) {
        console.error(error); // Log the actual error
        res.status(500).json({ error: "Failed to retrieve game state" });
    }
});

module.exports = router;
