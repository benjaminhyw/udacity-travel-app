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

async function fetchWeatherData(zipCode) {
  const query = `${BASEURL}zip=${zipCode}&appid=${WEATHERAPIKEY}`;
  const response = await fetch(query);
  console.log("fetchWeatherData Response:");

  return await response.json();
}

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Routes
app.get("/all", sendData);

function sendData(request, response) {
  response.send(projectData);
}

app.post("/add", callBack);

function callBack(request, response) {
  console.log("POST");
  fetchWeatherData(request.body.zip)
    .then((res) => {
      // console.log(JSON.stringify(res.body));
      // console.log(JSON.stringify(res));
      console.log("!!!.then()!!!");
      // console.log(JSON.stringify(res.body));
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

  // let updatedProjectData = {
  //   temperature: request.body.temperature,
  //   date: request.body.date,
  //   userResponse: request.body.userResponse,
  // };

  // projectData[request.body.date] = updatedProjectData;

  console.log(projectData);
}
