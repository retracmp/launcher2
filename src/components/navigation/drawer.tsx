import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";
import { useServerManager } from "src/wrapper/server";
import { useDownloadState } from "src/wrapper/download";
import { useOptions } from "src/wrapper/options";
import { openUrl } from "@tauri-apps/plugin-opener";

import { SimpleUI } from "src/import/ui";
import * as axios from "src/axios/client";

const Drawer = () => {
  const application = useApplicationInformation();
  const userManager = useUserManager();
  const options = useOptions();

  const state = options.disable_drawer
    ? SimpleUI.DrawerState.Disabled
    : options.wide_drawer
    ? SimpleUI.DrawerState.Expanded
    : SimpleUI.DrawerState.Collapsed;

  const developer_mode = axios.dev || application.dev || userManager.is_dev();
  console.log("Drawer render - Developer Mode:", developer_mode);

  const servers = useServerManager((s) => s._servers);
  const serverCount = Object.values(servers).length;

  const builds = useDownloadState((s) => s.active_download_progress);
  const buildCount = Object.values(Object.fromEntries(builds.entries())).length;

  const AuthenticatedDrawerItems = {
    top: [
      {
        label: "Home",
        icon: "IoHomeSharp",
        clicked: {
          type: "LINK",
          href: "/app/home",
        },
      },
      {
        label: "Leaderboard",
        icon: "IoTrophySharp",
        clicked: {
          type: "LINK",
          href: "/app/leaderboard",
        },
      },
      {
        label: "Library",
        icon: "IoFileTrayFullSharp",
        clicked: {
          type: "LINK",
          href: "/app/library",
        },
        notification:
          buildCount > 0
            ? {
                colour_scheme: "grey",
                text: buildCount.toString(),
              }
            : undefined,
      },
      {
        label: "Matches",
        icon: "IoPulseSharp",
        clicked: {
          type: "LINK",
          href: "/app/status",
        },
        notification:
          serverCount > 0
            ? {
                colour_scheme: "grey",
                text: serverCount.toString(),
              }
            : undefined,
      },
      {
        label: "Donate",
        icon: "IoSparklesSharp",
        clicked: {
          type: "LINK",
          href: "/app/store",
        },
        colour_scheme: "yellow",
      },
      {
        label: "Need Help?",
        icon: "IoAccessibilitySharp",
        clicked: {
          type: "FUNCTION",
          fn: () => {
            openUrl("https://discord.gg/6sNFtW4Hva");
          },
        },
      },
    ],
    bottom: [
      application.updateNeeded != null
        ? {
            label: "Update",
            icon: "IoBuildSharp",
            clicked: {
              type: "LINK",
              href: "/update",
            },
            colour_scheme: "blue",
          }
        : null,
      developer_mode
        ? {
            label: "Clans",
            icon: "IoPeopleSharp",
            clicked: {
              type: "LINK",
              href: "/app/clans",
            },
            colour_scheme: "purple",
          }
        : null,
      developer_mode
        ? {
            label: "Developer",
            icon: "IoConstructSharp",
            clicked: {
              type: "LINK",
              href: "/developer",
            },
          }
        : null,
      {
        label: "Downloads",
        icon: "IoArchiveSharp",
        clicked: {
          type: "LINK",
          href: "/app/downloads",
        },
      },
      {
        label: "Settings",
        icon: "IoSettingsSharp",
        clicked: {
          type: "LINK",
          href: "/app/settings",
        },
      },
    ],
  } as SimpleUI.DrawerItemsOptions;

  const EmptyDrawerItems = {
    top: [
      {
        label: "Welcome",
        icon: "IoLockClosedSharp",
        clicked: {
          type: "LINK",
          href: "/",
        },
      },
      {
        label: "Need Help?",
        icon: "IoAccessibilitySharp",
        clicked: {
          type: "FUNCTION",
          fn: () => {
            openUrl("https://discord.gg/6sNFtW4Hva");
          },
        },
      },
      developer_mode
        ? {
            label: "Developer",
            icon: "IoConstructSharp",
            clicked: {
              type: "LINK",
              href: "/developer",
            },
          }
        : null,
      application.updateNeeded != null
        ? {
            label: "Update",
            icon: "IoBuildSharp",
            clicked: {
              type: "LINK",
              href: "/update",
            },
          }
        : null,
    ],
    bottom: [],
  } as SimpleUI.DrawerItemsOptions;

  const routes = !userManager.access()
    ? EmptyDrawerItems
    : AuthenticatedDrawerItems;

  return <SimpleUI.Drawer state={state} items={routes} />;
};

export default Drawer;
