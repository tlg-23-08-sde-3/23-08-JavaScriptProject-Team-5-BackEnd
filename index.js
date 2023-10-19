// Core modules
const path = require("path");
const http = require("http");

// Third-party modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketIo = require("socket.io");
require("dotenv").config();

// Custom modules
const db = require("./utils/db");
const userRoutes = require("./routes/userRoutes");
const pixabayRoutes = require("./routes/pixabayRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

const app = express();

// Middleware configurations
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../Frontend")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/pixabay", pixabayRoutes);
app.use("/api/scores", scoreRoutes);

// Set up HTTP server and Socket.io
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
    console.log("New client connected");

    // Example: Listen for a player's move and broadcast it
    socket.on("player_move", (data) => {
        // TODO: Handle the player's move, validate it, update game state, etc.
        // ...

        // Broadcast the move to the other player
        socket.broadcast.emit("opponent_move", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        // TODO: Handle player disconnection, notify other player, etc.
    });
});

// Connect to the database
db.connect();

// Start the server and listen on the defined port
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
