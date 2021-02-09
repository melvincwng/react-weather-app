import "./App.css";
import React, { useState, useEffect } from "react";
import WeatherIcon from "./components/WeatherIcon";
import WeatherExtraInfo from "./components/WeatherExtraInfo";
import LoaderApp from "./components/LoaderApp";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState("C");
  const [weatherData, setWeatherData] = useState({
    main: {},
    sys: {},
    weather: [{}],
    wind: { speed: 0.0 },
  });

  const [forecastData, setForecastData] = useState({ list: [{}] });

  const [weatherIcon, setWeatherIcon] = useState("loading");
  const [weatherDescription, setWeatherDescription] = useState("");

  const [cityLocalTime, setCityLocalTime] = useState("");

  const baseUrl = "http://api.openweathermap.org/data/2.5/";
  const endpoint = "weather";
  const endpointForecast = "forecast";
  const [city, setCity] = useState("London");

  const [queryUrl, setQueryUrl] = useState("");
  // `${baseUrl}${endpoint}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`

  const [forecastUrl, setForecastUrl] = useState("");
  // `${baseUrl}${endpointForecast}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`

  const timeConverter = (date, offset, showDate = false) => {
    // takes date object
    // returns string in format hh:mm AM/PM
    // offset is in seconds, and may not be
    // an integer number of hours
    // for line 44, it seems that GMT 0 and GMT -ve countries's date objects are OK
    // however, GMT +ve countries's date objects need to minus 1 day's worth of milliseconds
    const offsetMilliseconds = offset * 1000;
    console.log(offsetMilliseconds)
    const localDate = offsetMilliseconds <= 0 ? new Date(date.getTime()  + offsetMilliseconds) : new Date(date.getTime()  + offsetMilliseconds - 86400000);
    const hours24 = localDate.getUTCHours();
    const minutes = localDate.getUTCMinutes();
    const minutesPadded = minutes < 9 ? `0${minutes}` : minutes;
    const hours12 = hours24 % 12;
    const ampm = hours24 < 12 ? "AM" : "PM";

    const timeString = `${hours12}:${minutesPadded} ${ampm}`;

    if (showDate) {
      const day = localDate.getUTCDay();
      const dateNumber = localDate.getUTCDate();
      const month = localDate.getUTCMonth();
      const year = localDate.getUTCFullYear();
      const dateString = localDate.toLocaleDateString();
      return `${dateString} ${timeString}`;
    }

    return timeString;
  };

  const getInitialDataUsingGeolocation = (position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    setQueryUrl(
      `${baseUrl}${endpoint}?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
    setForecastUrl(
      `${baseUrl}${endpointForecast}?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
  };

  const getInitialDataUsingDefaultCity = (city) => {
    setQueryUrl(
      `${baseUrl}${endpoint}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
    setForecastUrl(
      `${baseUrl}${endpointForecast}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => getInitialDataUsingGeolocation(position),
      getInitialDataUsingDefaultCity(city)
    );
  }, [city]);

  useEffect(() => {
    const fetchQuery = fetch(queryUrl)
      .then((response) => response.json())
      .then((json) => {
        setWeatherData(json);
        console.log(weatherData);
      })
      .catch((err) => console.log(err));

    const fetchForecast = fetch(forecastUrl)
      .then((response) => response.json())
      .then((json) => {
        setForecastData(json);
        console.log(forecastData.list[0]);
      })
      .catch((err) => console.log(err));

    Promise.all([fetchQuery, fetchForecast]).then(() => {
      setIsLoading(false);
    });
  }, [queryUrl, forecastUrl]);

  useEffect(() => {
    try {
      const iconCode = weatherData.weather[0].icon;
      setWeatherIcon(`http://openweathermap.org/img/wn/${iconCode}@2x.png`);
      setWeatherDescription(weatherData.weather[0].description);
      setCityLocalTime(timeConverter(new Date(), weatherData.timezone, true));
      // setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [weatherData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQueryUrl(
      `${baseUrl}${endpoint}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
    setForecastUrl(
      `${baseUrl}${endpointForecast}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
  };

  const tempConverter = (temp) => {
    let convertedTemp = "";
    if (units === "F") {
      convertedTemp = ((temp - 273.15) * 9) / 5 + 32;
    } else {
      convertedTemp = temp - 273.15;
    }

    return convertedTemp.toFixed(1);
  };

  const currentDate = new Date();
  const currentDate_string = currentDate.toUTCString();

  const sunRise = new Date(weatherData.sys.sunrise * 1000);
  const sunSet = new Date(weatherData.sys.sunset * 1000);

  const getPrecipitationChance = (forecastData) => {
    try {
      if (forecastData.list[0].pop) {
        return `${Math.round(forecastData.list[0].pop * 100)}%`;
      } else {
        // no percentage of precipitation returned by API
        // i.e. no chance of precipitation in next 3 hours
        return "0%";
      }
    } catch (err) {
      console.log(err);
      return "N/A";
    }
  };

  const changeUnits = (e) => {
    setUnits(e.target.value);
  };

  return (
    <div className="App">
      <LoaderApp loading={isLoading} />
      <div className={isLoading ? "d-none" : ""}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City name"
            aria-label="input-box"
          />
          <input
            type="submit"
            value="Go"
            onSubmit={handleSubmit}
            aria-label="go-button"
          />
          <label htmlFor="C">
            <input
              type="radio"
              id="C"
              name="units"
              value="C"
              onChange={changeUnits}
              checked={units === "C"}
            />
            ºC
          </label>
          <label htmlFor="F">
            <input
              type="radio"
              id="F"
              name="units"
              value="F"
              onChange={changeUnits}
              checked={units === "F"}
            />
            ºF
          </label>
        </form>
        <div className="weather-info">
          <div className="info-small">{cityLocalTime}</div>
          <div className="weather-info-main">
            <WeatherIcon icon={weatherIcon} weather={weatherDescription} />
            <div>
              <div className="temp-current">
                {tempConverter(weatherData.main.temp)} º{units}
              </div>
              <div className="info-small">{weatherData.name}</div>
            </div>
          </div>
          <div className="weather-info-extras">
            <WeatherExtraInfo
              align="left"
              info={getPrecipitationChance(forecastData)}
              description="precipitation chance"
              image="umbrella.svg"
              imageAlt="umbrella in rainy weather"
              tooltip="Chance of rain/snow in the next 3 hours"
            />
            <WeatherExtraInfo
              align="right"
              info={`${tempConverter(weatherData.main.feels_like)} º${units}`}
              description="feels like"
              image="thermometer-sunny.svg"
              imageAlt="thermometer in sunny weather"
              tooltip="What temperature it really feels like outside, when accounting for humidity and wind"
            />
            <WeatherExtraInfo
              align="left"
              info={`${weatherData.main.humidity}%`}
              description="humidity"
              image="humidity.svg"
              imageAlt="thermometer with raindrop"
              tooltip="Humidity levels of 20-60% are in the 'Comfortable Range'."
            />
            <WeatherExtraInfo
              align="right"
              info={`${weatherData.wind.speed.toFixed(1)} m/s`}
              description="wind speed"
              image="windsock.svg"
              imageAlt="windsock"
              tooltip="Wind speeds above 12m/s can be dangerous"
            />
            <WeatherExtraInfo
              align="left"
              info={timeConverter(sunRise, weatherData.timezone)}
              description="sunrise"
              image="sunrise.svg"
              imageAlt="sun rising over horizon"
              tooltip="The time the first rays of sun appear on the horizon"
            />
            <WeatherExtraInfo
              align="right"
              info={timeConverter(sunSet, weatherData.timezone)}
              description="sunset"
              image="sunset.svg"
              imageAlt="sun setting on the horizon"
              tooltip="The time the last rays of sun disappear over the horizon"
            />
          </div>
        </div>
        <div className="attribution">
          Icons made by{" "}
          <a href="https://www.freepik.com" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
