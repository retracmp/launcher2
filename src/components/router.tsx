import * as rr from "@tanstack/react-router";

import UI from "./core/default";
import Frame from "src/components/core/frame";
import DeveloperPage from "src/components/routes/dev/page";
import HomePage from "src/components/routes/app/home/page";
import LoginPage from "src/components/routes/login/page";
import AppContainer from "./routes/app";
import RecentMatchesPage from "./routes/app/home/matches";
import SettingsPage from "./routes/app/settings/page";
import LeaderboardPage from "./routes/app/leaderboard/page";
import LibraryPage from "./routes/app/library/page";
import StatusPage from "./routes/app/status/page";
import StorePage from "./routes/app/store/page";
import DownloadsPage from "./routes/app/downloads/page";

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
  notFoundComponent: () => <rr.Navigate to="/app/home" />,
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
  path: "/home",
});

const recentMatches = rr.createRoute({
  getParentRoute: () => home,
  component: () => <RecentMatchesPage />,
  path: "/matches",
});

export const settings = rr.createRoute({
  getParentRoute: () => appContainer,
  component: () => <SettingsPage />,
  path: "/settings",
});

export const leaderboard = rr.createRoute({
  getParentRoute: () => appContainer,
  component: () => <LeaderboardPage />,
  path: "/leaderboard",
});

export const library = rr.createRoute({
  getParentRoute: () => appContainer,
  component: () => <LibraryPage />,
  path: "/library",
});

export const downloads = rr.createRoute({
  getParentRoute: () => appContainer,
  component: () => <DownloadsPage />,
  path: "/downloads",
});

export const status = rr.createRoute({
  getParentRoute: () => appContainer,
  component: () => <StatusPage />,
  path: "/status",
});

export const store = rr.createRoute({
  getParentRoute: () => appContainer,
  component: () => <StorePage />,
  path: "/store",
});

const router = rr.createRouter({
  routeTree: rootRoute.addChildren([
    login,
    dev,
    appContainer.addChildren([
      home.addChildren([recentMatches]),
      settings,
      leaderboard,
      library,
      downloads,
      status,
      store,
    ]),
  ]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
