// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

let today = new Date(d.toLocaleDateString());
async function cityNameSubmitButtonClickHandler(event) {
  const city = document.getElementById("city").value;
  const travelDate = document.getElementById("date").value;

  event.preventDefault();

  await fetch("http://localhost:8081/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      city: city,
      travelDate: travelDate,
      todaysDate: newDate,
    }),
  }).then(async () => {
    await getAllCityData("http://localhost:8081/all");
  });
}

async function getAllCityData(route) {
  const todaysDate = document.getElementById("todaysDate");
  const cityName = document.getElementById("cityName");
  const latitude = document.getElementById("latitude");
  const longitude = document.getElementById("longitude");
  const country = document.getElementById("country");
  const travelDate = document.getElementById("travelDate");
  const daysBeforeDeparture = document.getElementById("daysBeforeDeparture");

  await fetch(route).then(async (result) => {
    result = await result.json();
    const d2 = new Date(document.getElementById("date").value);
    let formattedTravelDate =
      d2.getMonth() + "." + d2.getDate() + "." + d2.getFullYear();

    let timesDiff = Math.abs(d2.getTime() - today.getTime());
    let diffDays = Math.ceil(timesDiff / (1000 * 3600 * 24));

    // BEN TODO: if you use newDate as the way you enter data, it will always get overwritten
    // You will have to come back to this.
    todaysDate.innerHTML = `Today's Date: ${result[newDate].todaysDate}`;
    cityName.innerHTML = `Target Destination: ${result[newDate].cityName}`;
    latitude.innerHTML = `Latitude: ${result[newDate].latitude}`;
    longitude.innerHTML = `Longitude: ${result[newDate].longitude}`;
    country.innerHTML = `Country: ${result[newDate].country}`;
    travelDate.innerHTML = `Travel Date: ${formattedTravelDate}`;
    daysBeforeDeparture.innerHTML = `Days Before Departure: ${diffDays}`;
  });
}

export { cityNameSubmitButtonClickHandler };
