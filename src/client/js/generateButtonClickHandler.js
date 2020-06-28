async function generateButtonClickHandler(event) {
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
}

export { generateButtonClickHandler };
