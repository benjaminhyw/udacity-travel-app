const AYLIENTextAPI = require("aylien_textapi");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

dotenv.config();

const textapi = new AYLIENTextAPI({
  application_id: process.env.API_ID,
  application_key: process.env.API_KEY,
});

const app = express();
app.use(cors());
// // Initialize the main project folder
app.use(express.static("dist"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setup Server
const port = 8081;

console.log(__dirname);

app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
});

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

app.post("/sentiment", function (req, res) {
  console.log("::: Running express.post :::");
  console.log(req.body.text);

  textapi.sentiment({ text: req.body.text }, function (
    err,
    result,
    rateLimits
  ) {
    console.log("Error below:");
    console.log(err);
    console.log("Result below:");
    console.log(result);
    console.log("ERate Limits  below:");
    console.log(rateLimits);
    res.send(result);
  });
});

const WEATHERAPIKEY = process.env.WEATHERAPIKEY;
const BASEURL = "https://api.openweathermap.org/data/2.5/weather?";
const GEONAMESUSERNAME = process.env.GEONAMESUSERNAME;
const GEONAMESBASEURL = "http://api.geonames.org/searchJSON?q=";

async function fetchWeatherData(zipCode) {
  const query = `${BASEURL}zip=${zipCode}&appid=${WEATHERAPIKEY}`;
  const response = await fetch(query);

  return await response.json();
}

async function fetchWeatherDataGEONAMES(cityName) {
  const query = `${GEONAMESBASEURL}${cityName}&username=${GEONAMESUSERNAME}`;
  const response = await fetch(query);

  return await response.json();
}

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Routes
app.get("/all", sendData);

function sendData(request, response) {
  response.send(projectData);
}

app.post("/add", geonamesCallBack);

function callBack(request, response) {
  console.log("POST");
  fetchWeatherData(request.body.zip)
    .then((res) => {
      return res;
    })
    .then((res) => {
      console.log(res);
      let updatedProjectData = {
        temperature: res.main.temp,
        date: request.body.date,
        userResponse: request.body.feelings,
      };

      projectData[request.body.date] = updatedProjectData;

      response.send(res);
    });
}

function geonamesCallBack(request, response) {
  console.log("POST");
  fetchWeatherDataGEONAMES(request.body.city)
    .then((res) => {
      console.log(request.body);
      return res;
    })
    .then((res) => {
      console.log(res);
      let updatedProjectData = {
        cityName: request.body.city,
        latitude: res.geonames[0].lat,
        longitude: res.geonames[0].lng,
        country: res.geonames[0].countryName,
        date: request.body.date,
      };

      projectData[request.body.date] = updatedProjectData;

      response.send(res);
    });
}
