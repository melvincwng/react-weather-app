import React from "react";
import "../stylesheets/LoaderApp.css";
import Loader from "react-loader-spinner";

function LoaderApp({ loading }) {
  return (
    loading && (
      <div className="loading">
        <Loader type="TailSpin" color="#888888" height={200} width={200} />
      </div>
    )
  );
}

export default LoaderApp;
