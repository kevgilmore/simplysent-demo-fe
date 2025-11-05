import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Set a robust --vh CSS variable for mobile Safari to handle dynamic UI chrome
function setViewportUnitVariable() {
  // Use innerHeight which reflects the visible viewport excluding Safari toolbars
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

setViewportUnitVariable();
window.addEventListener("resize", setViewportUnitVariable);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}