// Create a new date instance dynamically with JS
const today = new Date();
const formattedToday =
  today.getMonth() + "." + today.getDate() + "." + today.getFullYear();

async function submitHandler(event) {
  event.preventDefault();
  const cityValue = document.getElementById("city").value.trim();
  const dateValue = document.getElementById("date").value;

  if (!Client.isValueEmpty(cityValue) && !Client.isValueEmpty(dateValue)) {
    console.log("::: Form Submitted :::");

    const travelDate = new Date(dateValue);
    const todaysDate = new Date(today.toLocaleDateString());
    const timesDiff = travelDate.getTime() - todaysDate.getTime();

    if (Math.sign(timesDiff) !== -1) {
      const daysBeforeDeparture = Math.ceil(timesDiff / (1000 * 3600 * 24));
      const formattedTravelDate =
        travelDate.getMonth() +
        "." +
        travelDate.getDate() +
        "." +
        travelDate.getFullYear();

      await fetch("http://localhost:8081/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: cityValue,
          formattedTravelDate: formattedTravelDate,
          formattedTodaysDate: formattedToday,
          daysBeforeDeparture: daysBeforeDeparture,
        }),
      }).then(async () => {
        await getAllCityData("http://localhost:8081/all");
      });
    } else {
      alert(
        "Selected date must be in the future.  Please select a new future date."
      );
    }
  } else {
    alert("Not all input values provided, please try again.");
  }
}

async function getAllCityData(route) {
  const formattedTodaysDate = document.getElementById("formattedTodaysDate");
  const cityName = document.getElementById("cityName");
  const latitude = document.getElementById("latitude");
  const longitude = document.getElementById("longitude");
  const country = document.getElementById("country");
  const formattedTravelDate = document.getElementById("formattedTravelDate");
  const daysBeforeDeparture = document.getElementById("daysBeforeDeparture");
  const currentForecast = document.getElementById("currentForecast");
  const predictedForecast = document.getElementById("predictedForecast");
  const locationPicture = document.getElementById("locationPicture");
  const error = document.getElementById("error");

  await fetch(route).then(async (result) => {
    result = await result.json();

    formattedTodaysDate.innerHTML = `Today's Date: ${result[formattedToday].formattedTodaysDate}`;
    cityName.innerHTML = `Target Destination: ${result[formattedToday].cityName}`;
    latitude.innerHTML = `Latitude: ${result[formattedToday].latitude}`;
    longitude.innerHTML = `Longitude: ${result[formattedToday].longitude}`;
    country.innerHTML = `Country: ${result[formattedToday].country}`;
    formattedTravelDate.innerHTML = `Travel Date: ${result[formattedToday].formattedTravelDate}`;
    daysBeforeDeparture.innerHTML = `Days Before Departure: ${result[formattedToday].daysBeforeDeparture}`;

    if (result[formattedToday].currentForecast) {
      currentForecast.innerHTML = `Current Forecast: ${result[formattedToday].currentForecast}`;
      predictedForecast.innerHTML = "";
    }

    if (result[formattedToday].predictedForecast) {
      predictedForecast.innerHTML = `Predicted Forecast: ${result[formattedToday].predictedForecast}`;
      currentForecast.innerHTML = "";
    }

    locationPicture.src = result[formattedToday].imageURL;
    locationPicture.height = "300";
    locationPicture.width = "300";

    error.innerHTML = `Error: ${result[formattedToday].error}`;
  });
}

export { submitHandler };
