const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./utils/db"); // Import the db module
const userRoutes = require("./routes/userRoutes");
const pixabayRoutes = require("./routes/pixabayRoutes"); // Import the Pixabay routes module

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/pixabay", pixabayRoutes); // Use the Pixabay routes

// Connect to the database
db.connect();

app.use(express.static(path.join(__dirname, "../Frontend")));

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
