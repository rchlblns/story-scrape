// Dependencies
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");

// Creating express app and configuring middleware needed for authentication
const app = express();
// Setting Up Morgan for loggin requests server side
app.use(logger("dev"));

// Handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Makes public folder a static directory
app.use(express.static(__dirname + "/public"));
// app.use(controller);
const controller = require("./controllers/controller.js")(app);

// Connect to the MongoDB
// Set moongoose to leverage ES6 promises
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/storyScraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("App running on port: " + PORT);
});

module.exports = dotenv;
