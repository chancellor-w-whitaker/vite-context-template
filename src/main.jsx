// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import React from "react";

import { Init } from "./components/Init.jsx";
import "./index.css";
import "./fonts.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Init></Init>
  </React.StrictMode>
);
