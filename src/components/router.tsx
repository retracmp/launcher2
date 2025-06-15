import * as rr from "@tanstack/react-router";

import UI from "./core/default";
import Frame from "src/components/core/frame";
import DeveloperPage from "src/components/routes/dev/page";
import HomePage from "src/components/routes/app/home/page";
import LoginPage from "src/components/routes/login/page";
import AppContainer from "./routes/app";
import RecentMatchesParent from "./routes/app/status/matches";
import SettingsPage from "./routes/app/settings/page";
import LeaderboardPage from "./routes/app/leaderboard/page";
import LibraryPage from "./routes/app/library/page";
import StatusPage from "./routes/app/status/page";
import StorePage from "./routes/app/store/page";
import DownloadsPage from "./routes/app/downloads/page";
import UpdatePage from "./routes/update/page";
import ExternalLoginPage from "./routes/app/external/page";
import EditorPage from "./routes/app/editor/page";

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

export const update = rr.createRoute({
  getParentRoute: () => rootRoute,
  component: () => <UpdatePage />,
  path: "/update",
});

export const appContainer = rr.createRoute({
  getParentRoute: () => rootRoute,
  component: () => <AppContainer />,
  path: "/app",
  notFoundComponent: () => <rr.Navigate to="/app/home" />,
  errorComponent: (props) => (
    <div className="flex flex-col p-2 gap-2">
      <div className="flex flex-col p-2 border-1 border-solid border-neutral-700/40 rounded-xs w-full max-w-full overflow-auto">
        <UI.P className="text-red-300">
          <pre>{props.error.message}</pre>
        </UI.P>
      </div>

      <div className="flex flex-col p-2 border-1 border-solid border-neutral-700/40 rounded-xs w-full max-w-full overflow-auto">
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
  component: () => <RecentMatchesParent />,
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

export const external = rr.createRoute({
  getParentRoute: () => appContainer,
  component: () => <ExternalLoginPage />,
  path: "/external",
});

export const editor = rr.createRoute({
  getParentRoute: () => appContainer,
  component: () => <EditorPage />,
  path: "/editor",
});

const router = rr.createRouter({
  routeTree: rootRoute.addChildren([
    login,
    dev,
    update,
    appContainer.addChildren([
      home.addChildren([recentMatches]),
      settings,
      leaderboard,
      library,
      downloads,
      status,
      store,
      external,
      editor,
    ]),
  ]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
