import React from "react";
import "../stylesheets/WeatherExtraInfo.css";

function WeatherExtraInfo({ align, info, description, image, imageAlt }) {
  function ExtraInfoIcon({ image, imageAlt }) {
    return (
      <div className="icon-container">
        <img
          className="icon"
          alt={imageAlt}
          src={process.env.PUBLIC_URL + `/assets/${image}`}
        ></img>
      </div>
    );
  }

  function ExtraInfoText({ info, description }) {
    return (
      <div>
        <div className="info-medium">{info}</div>
        <div className="info-small">{description}</div>
      </div>
    );
  }

  return align === "left" ? (
    <div className={`weather-info-cell-left`}>
      <ExtraInfoText info={info} description={description} />
      <ExtraInfoIcon image={image} imageAlt={imageAlt} />
    </div>
  ) : (
    <div className={`weather-info-cell-right`}>
      <ExtraInfoIcon image={image} imageAlt={imageAlt} />
      <ExtraInfoText info={info} description={description} />
    </div>
  );
}

export default WeatherExtraInfo;
