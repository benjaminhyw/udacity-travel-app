/* Global Variables */
const WEATHERAPIKEY = "d14498e1d6441199d14053bf26d766d9";
const BASEURL = "https://api.openweathermap.org/data/2.5/weather?";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

const generateButton = document.getElementById("generate");
generateButton.addEventListener("click", async (event) => {
  const zip = document.getElementById("zip").value;
  const feelings = document.getElementById("feelings").value;
  event.preventDefault();

  await (await fetchWeatherData(zip))
    .json()
    .then(async (result) => {
      const object = {
        date: newDate,
        temperature: result.main.temp,
        userResponse: feelings,
      };
      return object;
    })
    .then(async (result) => {
      await postWeatherData("/add", result);
    })
    .then(async () => {
      let response = await getAllWeatherData("/all");
      console.log(response);
    });
});

async function fetchWeatherData(zipCode) {
  const query = `${BASEURL}zip=${zipCode}&appid=${WEATHERAPIKEY}`;
  return await fetch(query);
}

async function postWeatherData(url = "", data = {}) {
  await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function getAllWeatherData(route) {
  const date = document.getElementById("date");
  const temp = document.getElementById("temp");
  const content = document.getElementById("content");

  await fetch(route).then(async (result) => {
    result = await result.json();

    date.innerHTML = result[newDate].date;
    temp.innerHTML = result[newDate].temperature;
    content.innerHTML = result[newDate].userResponse;
  });
}
