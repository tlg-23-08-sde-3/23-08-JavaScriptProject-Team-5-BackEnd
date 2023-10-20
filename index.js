// Core modules
const path = require("path");

// Third-party modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Custom modules
const db = require("./utils/db");
const userRoutes = require("./routes/userRoutes");
const pixabayRoutes = require("./routes/pixabayRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const gameRoutes = require("./routes/gameRoutes");

const app = express();

// Middleware configurations
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../Frontend")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/pixabay", pixabayRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/game", gameRoutes);

// Connect to the database
db.connect();

// Start the server and listen on the defined port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
