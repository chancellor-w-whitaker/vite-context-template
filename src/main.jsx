import ReactDOM from "react-dom/client";
import React from "react";

import { Wrapper } from "./components/Wrapper";
import App from "./App";
import "./index.css";
import "./fonts.css";
import { isEkuOnline } from "./constants/isEkuOnline";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Wrapper heading={isEkuOnline ? "EKU Online" : "Factbook"}>
      <App></App>
    </Wrapper>
  </React.StrictMode>
);
