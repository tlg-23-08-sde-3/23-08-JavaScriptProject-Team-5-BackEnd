const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());

require("dotenv").config();

app.use(express.static(path.join(__dirname, "../Frontend")));

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

app.post("/create", async (req, res) => {
    const { prompt } = req.body;
    const pixabayApiKey = process.env.PIXABAY_API_KEY;

    try {
        const pixabayResponse = await axios.get("https://pixabay.com/api/", {
            params: {
                key: pixabayApiKey,
                q: prompt,
                min_width: 150,
                min_height: 100,
                safesearch: true,
                editors_choice: true,
                orientation: "horizontal",
            },
        });

        if (
            pixabayResponse.data &&
            pixabayResponse.data.hits &&
            pixabayResponse.data.hits.length > 0
        ) {
            const randomIndex = Math.floor(
                Math.random() * pixabayResponse.data.hits.length
            );
            const randomImageUrl =
                pixabayResponse.data.hits[randomIndex].previewURL;
            res.send(randomImageUrl);
        } else {
            res.status(500).send("No images found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching the image.");
    }
});
