//required packages
const express = require("express");

const mongoose = require("mongoose");

// Set up our express app
const app = express();
const PORT = process.env.PORT || 8080;

//middleweare
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//connect to the MongoDB

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
//Start the server
app.listen(PORT, function() {
    console.log("The server is running on localhost:" + PORT);
});