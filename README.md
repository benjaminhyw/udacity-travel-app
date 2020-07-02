# udacity-travel-app

This is my submission for Udacity's Front End Developer Nanodegree - Travel App Project.

This app does the following:
Takes user input for Location & Date, and hits 3 different API's to retrieve information about the trip. Information is then dynamically displayed to the user.

## Instructions:

- Clone Project
- `yarn install` all dependencies
- Create account on [Geonames](http://www.geonames.org/export/web-services.html), get Username
- Create account on [Weatherbit](https://www.weatherbit.io/account/create), get API Key
- Create account on [Pixabay](https://pixabay.com/api/docs/), get API Key
- Create .env file, and add values to the following constants like so (without curly braces):
  GEONAMES_USERNAME={geonamesUSERNAME}
  WEATHERBIT_APIKEY={weatherbitAPIKEY}
  PIXABAY_APIKEY={pixabayAPIKEY}
- (To build dist folder, run `ran build`)
- In one terminal, run `yarn start` (express)
- In another terminal, run `yarn dev`
- Navigate to `localhost:8080`
- To run tests, run `yarn jest`

All requested features work as expected.
