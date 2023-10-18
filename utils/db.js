require("dotenv").config();
const mongoose = require("mongoose");

const url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.zr4j1bb.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
    connect: async () => {
        try {
            await mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Connected to db");
        } catch (error) {
            console.log(error);
        }
    },
};
