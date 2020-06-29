const WEATHERAPIKEY = process.env.WEATHERAPIKEY;
const BASEURL = "https://api.openweathermap.org/data/2.5/weather?";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

async function generateButtonClickHandler(event) {
  const zip = document.getElementById("zip").value;
  const feelings = document.getElementById("feelings").value;
  event.preventDefault();

  await fetch("http://localhost:8081/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ zip: zip, feelings: feelings, date: newDate }),
  }).then(async () => {
    await getAllWeatherData("http://localhost:8081/all");
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

export { generateButtonClickHandler };
