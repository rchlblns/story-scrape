// Dependencies

const express = require("express");
const mongoose = require("mongoose");


// Creating express app and configuring middleware needed for authentication
const app = express();
// Parses request as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Makes public a static folder
app.use(express.static("public"));

// Handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/newsScraper";

// Requiring our routes
require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("App running on port: " + PORT);
})

