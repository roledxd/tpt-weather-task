const https = require("https");

const latitude = 59.5227;
const longitude = 25.1583;

const headers = {
  "User-Agent": "TA22VROMAN/1.0 (roman.ledjajev@tptlive.ee)",
  "Content-Type": "application/json",
  Accept: "application/json",
};

const options = {
  hostname: "api.met.no",
  path: `/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`,
  method: "GET",
  headers: headers,
};

const request = https.request(options, (response) => {
  let data = "";

  response.on("data", (chunk) => {
    data += chunk;
  });

  response.on("end", () => {
    const weatherData = JSON.parse(data);
    displayWeatherForecast(weatherData);
  });
});

request.on("error", (error) => {
  console.error("Error making the request:", error.message);
});

request.end();

function displayWeatherForecast(weatherData) {
  const timeSeries = weatherData.properties.timeseries;

  console.log(
    "Current Temperature at Neeme:",
    timeSeries[0].data.instant.details.air_temperature + "°C"
  );

  console.log("Upcoming Forecast for Neeme:");
  for (let i = 1; i < Math.min(timeSeries.length, 4); i++) {
    const forecast = timeSeries[i];
    const time = forecast.time;
    const temperature = forecast.data.instant.details.air_temperature;
    console.log(`${time} ${temperature}°C`);
  }
}
