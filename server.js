//required packages
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

// Set up our express app
const app = express();
const PORT = process.env.PORT || 8080;

//Link to the models
var db = require("./models");

//middleweare
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//connect to the MongoDB
mongoose.connect("mongodb://localhost/newsscraper", {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
        res.json(articles);
    });
});
//Start the server
app.listen(PORT, function() {
    console.log("The server is running on localhost:" + PORT);
});