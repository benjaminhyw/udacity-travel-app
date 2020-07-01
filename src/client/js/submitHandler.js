// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

async function submitHandler(event) {
  event.preventDefault();
  const cityValue = document.getElementById("city").value.trim();
  const dateValue = document.getElementById("date").value;

  if (!Client.isValueEmpty(cityValue) && !Client.isValueEmpty(dateValue)) {
    console.log("::: Form Submitted :::");

    let travelDate = new Date(dateValue);
    let formattedTravelDate =
      travelDate.getMonth() +
      "." +
      travelDate.getDate() +
      "." +
      travelDate.getFullYear();
    let today = new Date(d.toLocaleDateString());
    let timesDiff = travelDate.getTime() - today.getTime();

    if (Math.sign(timesDiff) !== -1) {
      let daysBeforeDeparture = Math.ceil(timesDiff / (1000 * 3600 * 24));

      await fetch("http://localhost:8081/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: cityValue,
          formattedTravelDate: formattedTravelDate,
          formattedTodaysDate: newDate,
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

  await fetch(route).then(async (result) => {
    result = await result.json();

    formattedTodaysDate.innerHTML = `Today's Date: ${result[newDate].formattedTodaysDate}`;
    cityName.innerHTML = `Target Destination: ${result[newDate].cityName}`;
    latitude.innerHTML = `Latitude: ${result[newDate].latitude}`;
    longitude.innerHTML = `Longitude: ${result[newDate].longitude}`;
    country.innerHTML = `Country: ${result[newDate].country}`;
    formattedTravelDate.innerHTML = `Travel Date: ${result[newDate].formattedTravelDate}`;
    daysBeforeDeparture.innerHTML = `Days Before Departure: ${result[newDate].daysBeforeDeparture}`;

    if (result[newDate].currentForecast) {
      currentForecast.innerHTML = `Current Forecast: ${result[newDate].currentForecast}`;
      predictedForecast.innerHTML = "";
    }

    if (result[newDate].predictedForecast) {
      predictedForecast.innerHTML = `Predicted Forecast: ${result[newDate].predictedForecast}`;
      currentForecast.innerHTML = "";
    }
    locationPicture.src = result[newDate].imageURL;
    locationPicture.height = "300";
    locationPicture.width = "300";
  });
}

export { submitHandler };
