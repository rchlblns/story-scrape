// Dependencies
const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models");

//Routes 
module.exports = (app) => {
    // Get route for scraping recipes from Bon Appetit
    app.get("/scrape", function (req, res) {
        axios.get("https://www.bonappetit.com/recipes").then(function (response) {
            const $ = cheerio.load(response.data);

            $("div h1").each(function (i, element) {
                
                const result = {};

                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");

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
    app.get("/savedarticles", function (req, res) {
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
    // app.post("/savedarticles:id", function (req, res) {
    //     db.Note.create(req.body)
    //         .then(function (dbNote) {
    //             return db.Article.findOneAndUpdate({ _id: req.params.id }, {
    //                 note: dbNote._id
    //             }, { new: true });
    //         })
    //         .then(function (dbArticle) {
    //             res.json(dbArticle);
    //         })
    //         .catch(function (err) {
    //             res.json(err);
    //         });
    // });
}