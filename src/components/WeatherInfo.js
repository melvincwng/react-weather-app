import React, { useState, useEffect } from "react";
import WeatherMainInfo from "./WeatherMainInfo";
import WeatherExtraInfo from "./WeatherExtraInfo";
import MessageFlash from "./MessageFlash";

function WeatherInfo({
  cityName,
  temp,
  units,
  cityLocalTime,
  icon,
  weather,
  precipitation,
  feelsLike,
  humidity,
  windSpeed,
  sunrise,
  sunset,
}) {
  const [messageFlash, setMessageFlash] = useState({
    message: "",
    className: "",
  });

  const showToolTip = (tooltip) => {
    setMessageFlash({ message: tooltip, className: "tool-tip" });
  };

  const clearToolTip = () => {
    setMessageFlash({ message: "" });
  };

  return (
    <div className="weather-info">
      <WeatherMainInfo
        cityName={cityName}
        temp={temp}
        units={units}
        cityLocalTime={cityLocalTime}
        icon={icon}
        weather={weather}
      />
      <MessageFlash
        message={messageFlash.message}
        className={messageFlash.className}
      />
      <div className="weather-info-extras">
        <div
          onMouseOver={() => {
            showToolTip("Chance of rain/snow in the next 3 hours");
          }}
          onMouseLeave={clearToolTip}
        >
          <WeatherExtraInfo
            align="left"
            info={precipitation}
            description="precipitation chance"
            image="umbrella.svg"
            imageAlt="umbrella in rainy weather"
          />
        </div>
        <div
          onMouseOver={() => {
            showToolTip(
              "What temperature it really feels like outside, when accounting for humidity and wind"
            );
          }}
          onMouseLeave={clearToolTip}
        >
          <WeatherExtraInfo
            align="right"
            info={feelsLike}
            description="feels like"
            image="thermometer-sunny.svg"
            imageAlt="thermometer in sunny weather"
          />
        </div>
        <div
          onMouseOver={() => {
            showToolTip(
              "Humidity levels of 20-60% are in the 'Comfortable Range'."
            );
          }}
          onMouseLeave={clearToolTip}
        >
          <WeatherExtraInfo
            align="left"
            info={humidity}
            description="humidity"
            image="humidity.svg"
            imageAlt="thermometer with raindrop"
          />
        </div>
        <div
          onMouseOver={() => {
            showToolTip("Wind speeds above 12m/s can be dangerous");
          }}
          onMouseLeave={clearToolTip}
        >
          <WeatherExtraInfo
            align="right"
            info={windSpeed}
            description="wind speed"
            image="windsock.svg"
            imageAlt="windsock"
          />
        </div>
        {sunrise && <div
          onMouseOver={() => {
            showToolTip("The time the first rays of sun appear on the horizon");
          }}
          onMouseLeave={clearToolTip}
        >
          <WeatherExtraInfo
            align="left"
            info={sunrise}
            description="sunrise"
            image="sunrise.svg"
            imageAlt="sun rising over horizon"
          />
        </div>}
        {sunset && <div
          onMouseOver={() => {
            showToolTip(
              "The time the last rays of sun disappear over the horizon"
            );
          }}
          onMouseLeave={clearToolTip}
        >
          <WeatherExtraInfo
            align="right"
            info={sunset}
            description="sunset"
            image="sunset.svg"
            imageAlt="sun setting on the horizon"
          />
        </div>}
      </div>
    </div>
  );
}

export default WeatherInfo;
