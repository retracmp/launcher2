import * as rr from "@tanstack/react-router";

import Frame from "src/components/core/frame";
import DeveloperPage from "src/components/routes/dev/page";

export const rootRoute = rr.createRootRoute({
  component: () => <Frame />,
  notFoundComponent: () => <rr.Navigate to="/" />,
});

export const dev = rr.createRoute({
  getParentRoute: () => rootRoute,
  component: () => <DeveloperPage />,
  path: "/developer",
});

const router = rr.createRouter({
  routeTree: rootRoute.addChildren([dev]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
