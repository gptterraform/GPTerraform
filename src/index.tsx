import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Tour from "./components/Tour";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Tour>
      <App />
    </Tour>
  </React.StrictMode>
);
