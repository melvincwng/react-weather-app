import React from "react";

function LoaderApp({ loading }) {
  return loading && <div className="loading">Loading...</div>;
}

export default LoaderApp;
