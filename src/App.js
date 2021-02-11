import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import LoaderApp from "./components/LoaderApp";
import Footer from "./components/Footer";
import WeatherInfo from "./components/WeatherInfo";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react-dom";

function App() {
  // constants
  const baseUrl = "http://api.openweathermap.org/data/2.5/";
  const endpoint = "weather";
  const endpointForecast = "forecast";

  // state and state-dependent declarations
  const initialRender = useRef(true);
  const [isValidCity, setIsValidCity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState("C");
  const [isForecast, setIsForecast] = useState(false);
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
  const [city, setCity] = useState("London");
  const [queryCity, setQueryCity] = useState("London");
  const [queryUrl, setQueryUrl] = useState(
    `${baseUrl}${endpoint}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
  );
  const [forecastUrl, setForecastUrl] = useState(
    `${baseUrl}${endpointForecast}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
  );

  if (initialRender.current) {
    console.log("initial render");
  }

  const [mainTemp, setMainTemp] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [precipitationChance, setPrecipitationChance] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);

  // effects
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      getInitialDataUsingGeolocation,
      getInitialDataUsingDefaultCity
    );
  }, []);

  // useEffect(() => {
  //   if (messageFlash.message === "") return;
  //   setTimeout(() => {
  //     setMessageFlash({ message: "", className: "" });
  //   }, 6000);
  // }, [messageFlash]);

  useEffect(() => {
    if (initialRender.current === false) {
      console.log("query fired due to change in queryUrl or forecastUrl");
      const fetchQuery = fetch(queryUrl)
        .then((response) => response.json())
        .then((json) => {
          if (json.cod === "404") {
            setIsValidCity(false);
          } else {
            setWeatherData(json);
            setIsValidCity(true);
          }
        })
        .catch(console.log);

      const fetchForecast = fetch(forecastUrl)
        .then((response) => response.json())
        .then((json) => {
          if (json.cod === "404") {
            setIsValidCity(false);
          } else {
            setForecastData(json);
            setIsValidCity(true);
          }
        })
        .catch(console.log);

      Promise.all([fetchQuery, fetchForecast]).then(() => {
        setIsLoading(false);
      });
    }
  }, [queryUrl, forecastUrl]);

  useEffect(() => {
    if (!isForecast) {
      try {
        const iconCode = weatherData.weather[0].icon;
        if (!iconCode) return;
        setWeatherIcon(
          `${process.env.PUBLIC_URL}/assets/owm_weather_codes/${iconCode}@2x.png`
        );
        setWeatherDescription(weatherData.weather[0].description);
        setCityLocalTime(timeConverter(Date.now(), weatherData.timezone, true));
        setMainTemp(tempConverter(weatherData.main.temp));
        setFeelsLike(`${tempConverter(
          weatherData.main.feels_like
        )} º${units}`);
        setPrecipitationChance(getPrecipitationChance(forecastData));
        setHumidity(`${weatherData.main.humidity}%`);
        setWindSpeed(`${weatherData.wind.speed.toFixed(1)} m/s`);
        setSunrise(timeConverter(weatherData.sys.sunrise * 1000, weatherData.timezone));
        setSunset(timeConverter(weatherData.sys.sunset * 1000, weatherData.timezone));
     
        // setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    } 
  }, [weatherData, isForecast, units, forecastData]);

  useEffect(() => {
    if (isForecast) {
      try {
        const iconCode = forecastData.list[7].weather[0].icon;
        if (!iconCode) return;
        setWeatherIcon(
          `${process.env.PUBLIC_URL}/assets/owm_weather_codes/${iconCode}@2x.png`
        );
        setWeatherDescription(forecastData.list[7].weather[0].description);
        setCityLocalTime(timeConverter(Date.now() + 86400000, forecastData.city.timezone, true));
        setMainTemp(tempConverter(forecastData.list[7].main.temp));
        setFeelsLike(`${tempConverter(
          forecastData.list[7].main.feels_like
        )} º${units}`);
        setPrecipitationChance(getPrecipitationChance(forecastData, {forecast24:true}));
        setHumidity(`${forecastData.list[7].main.humidity}%`);
        setWindSpeed(`${forecastData.list[7].wind.speed.toFixed(1)} m/s`);
        setSunrise(null);
        setSunset(null);
        // setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  }, [forecastData, isForecast, units]);

  // functions - conversions
  const timeConverter = (date, offset, showDate = false) => {
    // takes date as timestamp, not as date object
    // shows time in this format: 1:23 pm
    // if showDate is true, shows date in this format:
    // Wed, 10 Feb 2021, 12:00 pm
    // offset is in seconds, and may not be
    // an integer number of hours
   
    const offsetMilliseconds = offset * 1000;
    const localDate = new Date(date + offsetMilliseconds);
    
    let options = {
      timeZone: "UTC",
      hour: "numeric",
      minute: "2-digit",
      hourCycle: "h12",
    };
    if (showDate) {
      options = {
        ...options,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
    }
   
    const timeString = localDate.toLocaleString("en-GB", options);
    return timeString;
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

  // functions - API-related

  const getInitialDataUsingGeolocation = (position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    console.log("geolocation query fired during initial render");
    setQueryUrl(
      `${baseUrl}${endpoint}?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
    setForecastUrl(
      `${baseUrl}${endpointForecast}?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
    initialRender.current = false;
  };

  const getInitialDataUsingDefaultCity = () => {
    console.log("default city query fired during initial render");
    setQueryUrl(
      `${baseUrl}${endpoint}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
    setForecastUrl(
      `${baseUrl}${endpointForecast}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
    initialRender.current = false;
  };

  const getPrecipitationChance = (forecastData, options={}) => {
    const forecastEntry = options.forecast24 ? 7 : 0; 
    try {
      if (forecastData.list[0].pop) {
        return `${Math.round(forecastData.list[forecastEntry].pop * 100)}%`;
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

  // functions - event handlers
  const changeUnits = (e) => {
    const isCelsius = e.target.checked;
    if (isCelsius) {
      setUnits("C");
    } else {
      setUnits("F");
    }
  };

  const changeForecast = () => {
    setIsForecast(!isForecast)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city === "") return;
    setQueryCity(city);
    setQueryUrl(
      `${baseUrl}${endpoint}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
    setForecastUrl(
      `${baseUrl}${endpointForecast}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
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
          <div className="temp-button-container">
          <FormControlLabel
              control={
                <Switch
                  checked={isForecast}
                  onChange={changeForecast}
                  color="primary"
                />
              }
              label="24h forecast"
              />
            <FormControlLabel
              control={
                <Switch
                  checked={units === "C"}
                  onChange={changeUnits}
                  color="primary"
                />
              }
              label="Celsius"
            />
          </div>
        </form>
        {isValidCity === false && `No weather data found for ${queryCity} 😞 `}
        {isValidCity && (
          <WeatherInfo
            cityName={weatherData.name}
            temp={mainTemp}
            units={units}
            cityLocalTime={cityLocalTime}
            icon={weatherIcon}
            weather={weatherDescription}
            precipitation={precipitationChance}
            feelsLike={feelsLike}
            humidity={humidity}
            windSpeed={windSpeed}
            sunrise={sunrise}
            sunset={sunset}
          />
        )}
        <Footer />
      </div>
    </div>
  );
}

export default App;
