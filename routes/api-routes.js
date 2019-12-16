const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

//Link to the models
var db = require("../models");

module.exports = function(app) {
    //route that displays all the new stories
    app.get("/all", function(req, res) {
        db.Article.find({})
            .populate("comments")
            .then(function(articles) {
                formatDate(articles);

                res.json(articles);
            });
    });
    //scrapes the news stories
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
            db.Article.insertMany(articles, { ordered: false });

            res.json("Web site scraped database updated");
        });
    });

    // adds a new comment
    app.post("/comment", function(req, res) {
        //save the comment to the database

        const text = req.body.text;
        const user = req.body.user;
        console.log(text, user);
        db.Comment.create({ text: text, user: user })
            .then(function(results) {
                console.log(results);
                return db.Article.findOneAndUpdate({ _id: req.body.articleID }, { $push: { comments: results._id } }, { new: true });
            })
            .catch(function(err) {
                console.log(err);
            });
    });

    // route for deleting comments
    app.delete("/delete", function(req, res) {
        db.Comment.deleteOne({ _id: req.body.id }, function(err) {
            if (err) return res.json(err);

            res.json("success");
        });
    });
};

function formatDate(articles) {
    for (let i = 0; i < articles.length; i++) {
        articles[i] = articles[i].toObject();
        articles[i].created_at = moment(articles[i].created_at).format("MMM Do YY");
    }
}