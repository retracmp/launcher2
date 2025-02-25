import React from "react";
import ReactDOM from "react-dom/client";

import * as rr from "@tanstack/react-router";
import router from "src/components/router";

import "src/main.css";
import Boostrap from "./components/core/boostrap";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Boostrap />
    <rr.RouterProvider router={router} />
  </React.StrictMode>
);
