const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    imageIndex: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

const gameSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    remainingTime: {
        type: Number,
        required: true,
    },
    flippedCards: {
        type: [Number], // indices of flipped cards
        required: true,
    },
    cardOrder: {
        type: [cardSchema], // array of cardSchema to store image URLs and their indices
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
