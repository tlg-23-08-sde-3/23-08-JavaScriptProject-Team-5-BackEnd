// Load environment variables from a .env file into process.env
require("dotenv").config();

const mongoose = require("mongoose");
const url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.zr4j1bb.mongodb.net/?retryWrites=true&w=majority`;

// Export an object with a 'connect' method
module.exports = {
    connect: async () => {
        try {
            // Attempt to connect to the MongoDB database using the constructed URL
            await mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Connected to DB");
        } catch (error) {
            // Log any errors that occur during the connection attempt
            console.log(error);
        }
    },
};
