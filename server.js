var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var request = require("request");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");

var app = express();

var PORT = process.env.PORT || 3000;

var db = require("./models");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(req, res){
    request("https://www.washingtonpost.com/", function(error, response, body){
        var $ = cheerio.load(body);

        $(".headline").each(function(i, element){

            var result = {};

            result.title = $(element).children("a").text();
            result.link = $(element).children("a").attr("href");
        })
    })
})

app.listen(PORT, function(){
    console.log("App listening on Port " + PORT);
})