const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

dotenv.config();

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

const GEONAMESUSERNAME = process.env.GEONAMESUSERNAME;
const GEONAMESBASEURL = "http://api.geonames.org/searchJSON?q=";

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
