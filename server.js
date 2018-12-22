// Dependencies
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const axios = require("axios");
const cheerio = require("cheerio");

// Requiring all models
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
// Setting Up Morgan for loggin requests server side
app.use(logger("dev"));
// Parses request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Makes public a static folder
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/storyScraper", { useNewUrlParser: true });

//Routes 

// Get route for scraping recipes from Bon Appetit
app.get("/scrape", function (req, res) {
    axios.get("https://www.bonappetit.com/recipes").then(function (response) {
        const $ = cheerio.load(response.data);

        $("h1 a").each(function (i, element) {
            const result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .text();

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        res.send("Scrape complete");
    });
});

// Route for getting all articles from the db
app.get("/articles", function (req, res) {
    db.Article.find().sort({ id: -1 })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for getting a specific article by id
app.get("/articles:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbarticle) {
            res.json(dbarticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for saving/updating an article's associated Note
app.post("/articles:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, {
                note: db_Note._id
            }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("App running on port: " + PORT);
});

