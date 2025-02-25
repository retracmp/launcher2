import React from "react";
import ReactDOM from "react-dom/client";

import "src/main.css";
import * as rr from "@tanstack/react-router";
import router from "src/components/router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <rr.RouterProvider router={router} />
  </React.StrictMode>
);
