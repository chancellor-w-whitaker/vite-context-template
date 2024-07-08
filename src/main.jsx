import ReactDOM from "react-dom/client";
import React from "react";

import { Wrapper } from "./components/Wrapper";
import App from "./App";
import "./index.css";
import "./fonts.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Wrapper>
      <App></App>
    </Wrapper>
  </React.StrictMode>
);
