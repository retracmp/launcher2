import React from "react";
import ReactDOM from "react-dom/client";

import * as rr from "@tanstack/react-router";
import router from "src/components/router";

import "src/main.css";
import Boostrap from "./components/core/bootstrap";
import TauriListeners from "./components/core/listeners";
import UpdateChecker from "./components/core/update";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Boostrap />
    <UpdateChecker />
    <TauriListeners />
    <rr.RouterProvider router={router} />
  </React.StrictMode>
);
