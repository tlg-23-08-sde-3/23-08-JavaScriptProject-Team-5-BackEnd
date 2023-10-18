const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
