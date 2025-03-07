import * as rr from "@tanstack/react-router";

import UI from "./core/default";
import Frame from "src/components/core/frame";
import DeveloperPage from "src/components/routes/dev/page";
import HomePage from "src/components/routes/app/home/page";
import LoginPage from "src/components/routes/login/page";
import AppContainer from "./routes/app";

export const rootRoute = rr.createRootRoute({
  component: () => <Frame />,
  notFoundComponent: () => <rr.Navigate to="/" />,
  errorComponent: () => (
    <div className="flex flex-col p-2 h-full w-full" data-tauri-drag-region>
      <UI.P>
        A critical error has occurred, please restart the application.
      </UI.P>
    </div>
  ),
});

export const login = rr.createRoute({
  getParentRoute: () => rootRoute,
  component: () => <LoginPage />,
  path: "/",
});

export const dev = rr.createRoute({
  getParentRoute: () => rootRoute,
  component: () => <DeveloperPage />,
  path: "/developer",
});

export const appContainer = rr.createRoute({
  getParentRoute: () => rootRoute,
  component: () => <AppContainer />,
  path: "/app",
  notFoundComponent: () => <rr.Navigate to="/app" />,
  errorComponent: (props) => (
    <div className="flex flex-col p-2 gap-2">
      <div className="flex flex-col p-2 border-1 border-solid border-[#2e2e2e] rounded-xs w-full max-w-full overflow-auto">
        <UI.P className="text-red-300">
          <pre>{props.error.message}</pre>
        </UI.P>
      </div>

      <div className="flex flex-col p-2 border-1 border-solid border-[#2e2e2e] rounded-xs w-full max-w-full overflow-auto">
        <UI.P className="text-fuchsia-300">
          <pre>{props.error.stack}</pre>
        </UI.P>
      </div>
    </div>
  ),
});

export const home = rr.createRoute({
  getParentRoute: () => appContainer,
  component: () => <HomePage />,
  path: "/",
});

const router = rr.createRouter({
  routeTree: rootRoute.addChildren([
    login,
    dev,
    appContainer.addChildren([home]),
  ]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
