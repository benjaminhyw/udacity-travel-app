// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
const port = 3000;

const server = app.listen(port, listening);

function listening() {
  console.log("server running");
  console.log(`running on localhost: ${port}`);
}

// Routes
app.get("/all", sendData);

function sendData(request, response) {
  response.send(projectData);
}

app.post("/add", callBack);

function callBack(request, response) {
  console.log("POST");

  let updatedProjectData = {
    temperature: request.body.temperature,
    date: request.body.date,
    userResponse: request.body.userResponse,
  };

  projectData[request.body.date] = updatedProjectData;

  console.log(projectData);

  response.send("POST received");
}
