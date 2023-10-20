const express = require("express");
const axios = require("axios");
const router = express.Router();

// Endpoint to fetch a random image based on a given prompt
router.post("/create", async (req, res) => {
    // Extract the 'prompt' from the request body
    const { prompt } = req.body;

    // Retrieve the Pixabay API key from environment variables
    const pixabayApiKey = process.env.PIXABAY_API_KEY;

    try {
        // Make an API request to Pixabay to fetch images related to the prompt
        const pixabayResponse = await axios.get("https://pixabay.com/api/", {
            params: {
                key: pixabayApiKey,
                q: prompt,
            },
        });

        // Check if the response contains any images
        if (
            pixabayResponse.data &&
            pixabayResponse.data.hits &&
            pixabayResponse.data.hits.length > 0
        ) {
            // Choose a random image from the returned list
            const randomIndex = Math.floor(
                Math.random() * pixabayResponse.data.hits.length
            );
            const randomImageUrl =
                pixabayResponse.data.hits[randomIndex].previewURL;

            // Send the random image URL in the response
            res.json({ imageUrl: randomImageUrl });
        } else {
            // If no images are found, send an error response
            res.status(500).send("No images found.");
        }
    } catch (err) {
        // Handle any errors during the API request
        console.error(err);
        res.status(500).send("An error occurred while fetching the image.");
    }
});

module.exports = router;
