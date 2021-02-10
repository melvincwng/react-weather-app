import React from "react";
import WeatherIcon from "./WeatherIcon";
import "../stylesheets/WeatherInfo.css";

function WeatherInfo({ cityName, temp, units, cityLocalTime, icon, weather }) {
  return (
    <div>
      <div className="info-small">{cityLocalTime}</div>
      <div className="weather-info-main">
        <WeatherIcon icon={icon} weather={weather} />
        <div className="temp-current-container">
          <div className="temp-current">
            {temp} º{units}
          </div>
          <div className="info-small">{cityName}</div>
        </div>
      </div>
    </div>
  );
}

export default WeatherInfo;
