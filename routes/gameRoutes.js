const express = require("express");
const router = express.Router();
const Game = require("../models/game");

// Endpoint to save the game state
router.post("/save", async (req, res) => {
    try {
        // Destructure game state details from the request body
        const { userId, remainingTime, flippedCards, cardOrder, difficulty } =
            req.body;

        // Check if a game state already exists for this user
        let gameState = await Game.findOne({ userId });
        if (gameState) {
            // Update existing game state with new details
            gameState.remainingTime = remainingTime;
            gameState.flippedCards = flippedCards;
            gameState.cardOrder = cardOrder.map((card) => ({
                imageIndex: card.imageIndex,
                imageUrl: card.imageUrl,
            }));
            gameState.difficulty = difficulty;
        } else {
            // If no game state exists, create a new one
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

        // Save the game state to the database
        await gameState.save();
        res.json({ success: true });
    } catch (error) {
        // Handle any errors during the save process
        console.error(error); // Log the actual error
        res.status(500).json({ error: "Failed to save game state" });
    }
});

// Endpoint to load the game state for a specific user
router.get("/load/:userId", async (req, res) => {
    try {
        // Extract userId from request parameters
        const { userId } = req.params;

        // Fetch the game state from the database
        const gameState = await Game.findOne({ userId });
        if (!gameState) {
            // If no game state exists, return a 404 status
            return res.status(404);
        }
        res.json(gameState);
    } catch (error) {
        // Handle any errors during the retrieval process
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve game state" });
    }
});

// Endpoint to delete the game state for a specific user
router.delete("/delete/:userId", async (req, res) => {
    try {
        // Extract userId from request parameters
        const { userId } = req.params;

        // Delete the game state from the database
        await Game.findOneAndDelete({ userId });
        res.json({ success: true });
    } catch (error) {
        // Handle any errors during the deletion process
        console.error(error);
        res.status(500).json({ error: "Failed to delete game state" });
    }
});

// Export the router to be used in the main app
module.exports = router;
