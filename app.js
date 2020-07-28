var express = require("express");
var app = express();
var request = require('request');
var bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

var weather;
var location;
var coordinate;

app.get("/", function(req, res) {
	res.render("home", {location: location});
});

app.post("/loc", function(req, res) {
    location = req.body.location;
    request('https://www.metaweather.com/api/location/search/?query='+location, function (error, response, body) {
      if(error){
        console.log(error);
      } else{
        coordinate = JSON.parse(body)[0].woeid;
        console.log(coordinate);
      }
    });
    request('https://www.metaweather.com/api/location/'+coordinate+'/', function (error, response, body) {
      if(error){
        console.log(error);
      } else{
        weather = JSON.parse(body).consolidated_weather[1].weather_state_name;
        console.log(weather);
      }
    });
	res.redirect("/");
})

app.get("*", function(req, res) {
	res.send("Invalid URL!!");
});

app.listen(3000, function () {
	console.log("Serving on localhost:3000");
})