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
mongoose.connect("mongodb://localhost/newsscraper", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
//Start the server
app.listen(PORT, function() {
    console.log("The server is running on localhost:" + PORT);
});