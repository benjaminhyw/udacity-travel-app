// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

async function cityNameSubmitButtonClickHandler(event) {
  const city = document.getElementById("city").value;
  event.preventDefault();

  await fetch("http://localhost:8081/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ city: city, date: newDate }),
  }).then(async () => {
    await getAllCityData("http://localhost:8081/all");
  });
}

async function getAllCityData(route) {
  const date = document.getElementById("date");
  const cityName = document.getElementById("cityName");
  const latitude = document.getElementById("latitude");
  const longitude = document.getElementById("longitude");
  const country = document.getElementById("country");

  await fetch(route).then(async (result) => {
    result = await result.json();

    date.innerHTML = result[newDate].date;
    cityName.innerHTML = result[newDate].cityName;
    latitude.innerHTML = result[newDate].latitude;
    longitude.innerHTML = result[newDate].longitude;
    country.innerHTML = result[newDate].country;
  });
}

export { cityNameSubmitButtonClickHandler };
