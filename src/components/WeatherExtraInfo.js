import React from "react";

function WeatherExtraInfo({ align, info, description, image, imageAlt, tooltip="hello" }) {
  function ExtraInfoIcon({ image, imageAlt }) {
    return (
      <div className="abcde">
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
    <div className={`weather-info-cell-left tooltip`}>
      <ExtraInfoText info={info} description={description} />
      <ExtraInfoIcon image={image} imageAlt={imageAlt} />
      <div className="tooltiptext">{tooltip}</div>
    </div>
  ) : (
    <div className={`weather-info-cell-right tooltip`}>
      <ExtraInfoIcon image={image} imageAlt={imageAlt} />
      <ExtraInfoText info={info} description={description} />
      <div className="tooltiptext">{tooltip}</div>
    </div>
  );
}

export default WeatherExtraInfo;
