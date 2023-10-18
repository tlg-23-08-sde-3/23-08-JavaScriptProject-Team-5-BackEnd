const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/create", async (req, res) => {
    const { prompt } = req.body;
    const pixabayApiKey = process.env.PIXABAY_API_KEY;

    try {
        const pixabayResponse = await axios.get("https://pixabay.com/api/", {
            params: {
                key: pixabayApiKey,
                q: prompt,
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
            res.json({ imageUrl: randomImageUrl });
        } else {
            res.status(500).send("No images found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching the image.");
    }
});

module.exports = router;
