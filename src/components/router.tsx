import * as rr from "@tanstack/react-router";

import Frame from "./core/frame";

export const rootRoute = rr.createRootRoute({
  component: () => <Frame />,
  notFoundComponent: () => <rr.Navigate to="/" />,
});

const router = rr.createRouter({
  routeTree: rootRoute.addChildren([]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
