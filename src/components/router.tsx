import * as rr from "@tanstack/react-router";

import Frame from "src/components/core/frame";
import DeveloperPage from "src/components/routes/dev/page";
import HomePage from "src/components/routes/home/page";
import LoginPage from "src/components/routes/login/page";

export const rootRoute = rr.createRootRoute({
  component: () => <Frame />,
  notFoundComponent: () => <rr.Navigate to="/" />,
});

export const login = rr.createRoute({
  getParentRoute: () => rootRoute,
  component: () => <LoginPage />,
  path: "/",
});

export const home = rr.createRoute({
  getParentRoute: () => rootRoute,
  component: () => <HomePage />,
  path: "/home",
});

export const dev = rr.createRoute({
  getParentRoute: () => rootRoute,
  component: () => <DeveloperPage />,
  path: "/developer",
});

const router = rr.createRouter({
  routeTree: rootRoute.addChildren([login, home, dev]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
