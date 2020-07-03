const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static("dist")); // Initialize the main project folder
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support url encoded bodies

// Setup Server
const port = 8081;

// Estabish API keys & base URL's
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;
const GEONAMES_BASEURL = "http://api.geonames.org/searchJSON?q=";

const WEATHERBIT_APIKEY = process.env.WEATHERBIT_APIKEY;
const WEATHERBIT_CURRENT_BASEURL = "https://api.weatherbit.io/v2.0/current?";
const WEATHERBIT_FORECAST_BASEURL =
  "https://api.weatherbit.io/v2.0/forecast/daily?";

const PIXABAY_APIKEY = process.env.PIXABAY_APIKEY;
const PIXABAY_BASEURL = `https://pixabay.com/api/?key=${PIXABAY_APIKEY}&q=`;

console.log(__dirname);

app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
});

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

// Establish fetch API functions
async function fetchGeonamesData(cityName) {
  const query = `${GEONAMES_BASEURL}${cityName}&username=${GEONAMES_USERNAME}`;
  const response = await fetch(query);

  return await response.json();
}

async function fetchWeatherbitData(latitude, longitude, daysBeforeDeparture) {
  let query = "";

  if (daysBeforeDeparture <= 7) {
    query = `${WEATHERBIT_CURRENT_BASEURL}`;
  } else {
    query = `${WEATHERBIT_FORECAST_BASEURL}`;
  }

  query = `${query}&lat=${latitude}&lon=${longitude}&key=${WEATHERBIT_APIKEY}`;
  const response = await fetch(query);

  return await response.json();
}

async function fetchPixabayData(cityName) {
  const query = `${PIXABAY_BASEURL}${cityName}&category=places&image_type=photo`;
  const response = await fetch(query);

  return await response.json();
}

// Setup empty JS object to act as endpoint for all routes
const projectData = {};

// Routes
app.get("/all", sendData);

function sendData(request, response) {
  response.send(projectData);
}

app.post("/add", addCallback);

function addCallback(request, response) {
  console.log("POST /add");
  fetchGeonamesData(request.body.city)
    .then((res) => {
      return res;
    })
    .then((geonamesRes) => {
      if (
        geonamesRes &&
        geonamesRes.geonames &&
        geonamesRes.geonames.length > 0
      ) {
        fetchWeatherbitData(
          geonamesRes.geonames[0].lat,
          geonamesRes.geonames[0].lng,
          request.body.daysBeforeDeparture
        ).then((weatherbitRes) => {
          fetchPixabayData(request.body.city).then((pixabayCityRes) => {
            let updatedProjectData = {
              cityName: request.body.city,
              latitude: geonamesRes.geonames[0].lat,
              longitude: geonamesRes.geonames[0].lng,
              country: geonamesRes.geonames[0].countryName,
              formattedTodaysDate: request.body.formattedTodaysDate,
              formattedTravelDate: request.body.formattedTravelDate,
              daysBeforeDeparture: request.body.daysBeforeDeparture,
            };

            if (updatedProjectData.daysBeforeDeparture <= 7) {
              updatedProjectData.currentForecast =
                weatherbitRes.data[0].weather.description;
              updatedProjectData.predictedForecast = undefined;
            } else {
              updatedProjectData.predictedForecast =
                weatherbitRes.data[0].weather.description;
              updatedProjectData.currentForecast = undefined;
            }

            if (
              pixabayCityRes &&
              pixabayCityRes.hits &&
              pixabayCityRes.hits.length > 0
            ) {
              updatedProjectData.imageURL =
                pixabayCityRes.hits[0].largeImageURL;

              projectData[
                request.body.formattedTodaysDate
              ] = updatedProjectData;

              response.send(weatherbitRes);
            } else {
              fetchPixabayData(geonamesRes.geonames[0].countryName).then(
                (pixabayCountryRes) => {
                  console.log(pixabayCountryRes);
                  if (
                    pixabayCityRes &&
                    pixabayCityRes.hits &&
                    pixabayCountryRes.hits.length > 0
                  ) {
                    updatedProjectData.imageURL =
                      pixabayCountryRes.hits[0].largeImageURL;
                  } else {
                    updatedProjectData.imageURL = undefined;
                  }
                  projectData[
                    request.body.formattedTodaysDate
                  ] = updatedProjectData;

                  response.send(weatherbitRes);
                }
              );
            }
          });
        });
      } else {
        projectData[request.body.formattedTodaysDate] = {
          error:
            "Could not find requested city.  Please check spelling, and try again.",
        };

        response.send(geonamesRes);
      }
    });
}

module.exports = app;
