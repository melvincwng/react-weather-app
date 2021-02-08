import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [weatherData, setWeatherData] = useState({
    main: {},
    sys: {},
  });

  const [forecastData, setForecastData] = useState({ list: [{}] });

  const baseUrl = "http://api.openweathermap.org/data/2.5/";
  const endpoint = "weather";
  const endpointForecast = "forecast";
  const [city, setCity] = useState("Singapore");

  const [queryUrl, setQueryUrl] = useState(
    `${baseUrl}${endpoint}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
  );

  const [forecastUrl, setForecastUrl] = useState(
    `${baseUrl}${endpointForecast}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
  );

  useEffect(() => {
    fetch(queryUrl)
      .then((response) => response.json())
      .then((json) => {
        setWeatherData(json);
        console.log(weatherData);
      })
      .catch((err) => console.log(err));

    fetch(forecastUrl)
      .then((response) => response.json())
      .then((json) => {
        setForecastData(json);
        console.log(forecastData.list[0]);
      })
      .catch((err) => console.log(err));
  }, [queryUrl, forecastUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQueryUrl(
      `${baseUrl}${endpoint}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
    setForecastUrl(
      `${baseUrl}${endpointForecast}?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`
    );
  };

  const tempConvertor = (temp) => {
    return (temp - 273.15).toFixed(1);
  };

  const currentDate = new Date();
  const currentDate_string = currentDate.toString();

  const sunRise = new Date(weatherData.sys.sunrise * 1000);
  const sunSet = new Date(weatherData.sys.sunset * 1000);

  const timeConverter = (date, offset) => {
    // takes date object
    // returns string in format hh:mm AM/PM
    // offset is in seconds, and may not be
    // an integer number of hours

    const offsetMilliseconds = offset * 1000;
    const localDate = new Date(date.getTime() + offsetMilliseconds);

    const hours24 = localDate.getUTCHours();
    const minutes = localDate.getUTCMinutes();
    const minutesPadded = minutes < 9 ? `0${minutes}` : minutes;
    const hours12 = hours24 % 12;
    const ampm = hours24 < 12 ? "AM" : "PM";

    return `${hours12}:${minutesPadded} ${ampm}`;
  };

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

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City name"
        />
        <input type="submit" value="Go" onSubmit={handleSubmit} />
      </form>
      <div className="weather-info">
        <div className="info-small">{currentDate_string}</div>
        <div className="weather-info-main">
          <img className="sun-image" src="https://www.flaticon.com/svg/vstatic/svg/1163/1163662.svg?token=exp=1612768510~hmac=9a5b49ed8badc28861a276267386b171" alt="sun"></img>
          <div>
              <div className="temp-current">
                {tempConvertor(weatherData.main.temp)} ºC
              </div>
              <div className="info-small">{weatherData.name}</div>
          </div>
        </div>
        <div className="weather-info-extras">
          <div className="weather-info-cell-left">
            <div>
              <div className="info-medium">
                {tempConvertor(weatherData.main.temp_min)} ºC
              </div>
              <div className="info-small">minimum</div>
            </div>
            <div className="abcde">
              <img className="icon down-arrow" alt="down" src="https://www.flaticon.com/svg/vstatic/svg/25/25415.svg?token=exp=1612769763~hmac=ccc354fb28c1e15a047f9a266a7b2f22"></img>
            </div>
          </div>
          <div className="weather-info-cell-right">
            <div className ="abcde">
              <img className="icon up-arrow" alt="up" src="https://www.flaticon.com/svg/vstatic/svg/25/25216.svg?token=exp=1612769763~hmac=a0e95f697331ab7079a9d0a394d890fe"></img>
            </div>
            <div>
              <div className="info-medium">
                {tempConvertor(weatherData.main.temp_max)} ºC
              </div>
              <div className="info-small">maximum</div>
            </div>
          </div>
          <div className="weather-info-cell-left">
            <div>
              <div className="info-medium">{weatherData.main.humidity} %</div>
              <div className="info-small">humidity</div>
            </div>
            <div className="abcde">
              <img className= "icon raindrop" src="https://www.flaticon.com/svg/vstatic/svg/1163/1163648.svg?token=exp=1612768510~hmac=f6f886707af800a53dd8c355bb82c1ba" alt="raindrop"></img>
            </div>
          </div>
          <div className="weather-info-cell-right">
            <div className="abcde">
              <img className="icon rain" src="https://www.flaticon.com/svg/vstatic/svg/1163/1163728.svg?token=exp=1612769590~hmac=ab0d2ab654ab6975b45a9ec4b89a3db7" alt="rain"></img>
            </div>
            <div>
              <div className="info-medium">{getPrecipitationChance(forecastData)}</div>
              <div className="info-small">precipitation chance</div>
            </div>
          </div>
          <div className="weather-info-cell-left">
            <div>
              <div className="info-medium">{timeConverter(sunRise, weatherData.timezone)}</div>
              <div className="info-small">sunrise</div>
            </div>
            <div className= "abcde"> 
              <img className="icon sun-rise" src="https://www.flaticon.com/svg/vstatic/svg/1163/1163663.svg?token=exp=1612768510~hmac=62f4d719d52625d4faeafd5131f02bca" alt="sunrise"></img>
            </div>
          </div>
          <div className="weather-info-cell-right">
            <div className="abcde">
            <img className= "icon sun-rise" src="https://www.flaticon.com/svg/vstatic/svg/1163/1163664.svg?token=exp=1612768510~hmac=4343603837f8f1118679b6e79eb99406" alt="sunset"></img>
            </div>
            <div>
              <div className="info-medium">{timeConverter(sunSet, weatherData.timezone)}</div>
              <div className="info-small">sunset</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
