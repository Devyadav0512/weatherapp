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
var temperature;
var image;

app.get("/", function(req, res) {
	res.render("home", {location: location, weather: weather, temperature: temperature, image: image});
});

app.post("/loc", async function(req, res) {
    location = req.body.location;
    await request('https://www.metaweather.com/api/location/search/?query='+location, function (err, res) {
      if(err){
        console.log(err);
      } else{
        coordinate = JSON.parse(res.body)[0].woeid;
        console.log(coordinate);
        request('https://www.metaweather.com/api/location/'+coordinate+'/', function (err, res) {
          if(err){
            console.log(err);
          } else{
            weather = JSON.parse(res.body).consolidated_weather[1].weather_state_name;
            temperature = JSON.parse(res.body).consolidated_weather[1].the_temp;
            image = "https://www.metaweather.com/static/img/weather/png/64/"+JSON.parse(res.body).consolidated_weather[1].weather_state_abbr+".png";
            console.log(weather);
            console.log(temperature);
            console.log(image);            
          }
        });       
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