const axios = require("axios");
const cheerio = require("cheerio");

//Link to the models
var db = require("../models");

module.exports = function(app) {
    app.get("/all", function(req, res) {
        db.Article.find({}, function(err, articles) {
            if (err) {
                res.json(err);
            }
            res.json(articles);
        });
    });

    app.get("/scrape", function(req, res) {
        axios.get("https://weeklyworldnews.com/").then(function(response) {
            const $ = cheerio.load(response.data);
            const articles = [];
            $(".inside-article").each(function(i, element) {
                const link = $(element)
                    .children(".post-image")
                    .children("a")
                    .attr("href");
                const title = $(element)
                    .children(".entry-header")
                    .children("h2")
                    .children("a")
                    .text();
                const description = $(element)
                    .children(".entry-summary")
                    .children("p")
                    .text();

                articles.push({
                    title: title,
                    link: link,
                    description: description
                });
            });
            db.Article.insertMany(articles);
            res.json("Web site scraped database updated");
        });
    });
};