const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Link to the models
var db = require("../models");

module.exports = function(app) {
  //route that displays all the news stories
  app.get("/all", function(req, res) {
    db.Article.find({})
      // shows newer stories first
      .sort({ _id: -1 })
      // adds the comments
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
      //insert the articles into the database, the {ordered: false} is used to prevent errors from stopping the inserts
      db.Article.insertMany(articles, { ordered: false });

      res.json("Web site scraped, database updated");
    });
  });
  // user signup
  app.post("/signup", function(req, res) {
    db.User.create(req.body)
      .then(function(result) {
        res.json({ message: "user was created" });
      })
      .catch(function(err) {
        res.status(500).json({ error: err.message });
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
        //adds the comment to the proper article
        return db.Article.findOneAndUpdate(
          { _id: req.body.articleID },
          { $push: { comments: results._id } },
          { new: true }
        );
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
//function for formatting the date into a more user friendly format
function formatDate(articles) {
  for (let i = 0; i < articles.length; i++) {
    articles[i] = articles[i].toObject();
    articles[i].created_at = moment(articles[i].created_at).format("MMM Do YY");
  }
}
