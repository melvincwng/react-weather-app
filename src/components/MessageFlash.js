import React, { useState, useEffect } from "react";
import "../stylesheets/MessageFlash.css";

function MessageFlash({ message, className }) {
  return (
    <div className={`message-flash ${className}`}>{message ? message : ""}</div>
  );
}

export default MessageFlash;
