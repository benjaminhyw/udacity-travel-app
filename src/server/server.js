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

const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;
const GEONAMESBASEURL = "http://api.geonames.org/searchJSON?q=";

const WEATHERBIT_APIKEY = process.env.WEATHERBIT_APIKEY;
const WEATHERBITCURRENTWEATHERBASEURL =
  "https://api.weatherbit.io/v2.0/current?";
const WEATHERBITFORECASTBASEURL =
  "https://api.weatherbit.io/v2.0/forecast/daily?";

const PIXABAY_APIKEY = process.env.PIXABAY_APIKEY;
const PIXABAYBASEURL = `https://pixabay.com/api/?key=${PIXABAY_APIKEY}&q=`;

async function fetchWeatherDataGEONAMES(cityName) {
  const query = `${GEONAMESBASEURL}${cityName}&username=${GEONAMES_USERNAME}`;
  const response = await fetch(query);

  return await response.json();
}

async function fetchWeatherDataWEATHERBIT(
  latitude,
  longitude,
  daysBeforeDeparture
) {
  let query = "";

  if (daysBeforeDeparture <= 7) {
    query = `${WEATHERBITCURRENTWEATHERBASEURL}`;
  } else {
    query = `${WEATHERBITFORECASTBASEURL}`;
  }

  query = `${query}&lat=${latitude}&lon=${longitude}&key=${WEATHERBIT_APIKEY}`;
  const response = await fetch(query);
  console.log("Inside fetchWeatherDataWeatherbit");

  return await response.json();
}

async function fetchWeatherDataPIXABAY(cityName) {
  const query = `${PIXABAYBASEURL}${cityName}`;
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
      return res;
    })
    .then((geonamesRes) => {
      fetchWeatherDataWEATHERBIT(
        geonamesRes.geonames[0].lat,
        geonamesRes.geonames[0].lng,
        request.body.daysBeforeDeparture
      ).then((weatherbitRes) => {
        console.log(weatherbitRes);

        fetchWeatherDataPIXABAY(request.body.city).then((pixabayRes) => {
          let updatedProjectData = {
            cityName: request.body.city,
            latitude: geonamesRes.geonames[0].lat,
            longitude: geonamesRes.geonames[0].lng,
            country: geonamesRes.geonames[0].countryName,
            todaysDate: request.body.todaysDate,
            travelDate: request.body.travelDate,
            daysBeforeDeparture: request.body.daysBeforeDeparture,
            imageURL: pixabayRes.hits[0].largeImageURL,
          };

          console.log(weatherbitRes);

          if (updatedProjectData.daysBeforeDeparture <= 7) {
            updatedProjectData.currentForecast =
              weatherbitRes.data[0].weather.description;
            updatedProjectData.predictedForecast = undefined;
          } else {
            updatedProjectData.predictedForecast =
              weatherbitRes.data[0].weather.description;
            updatedProjectData.currentForecast = undefined;
          }

          projectData[request.body.todaysDate] = updatedProjectData;

          response.send(weatherbitRes);
        });
      });
    });
}
