import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";
import { useServerManager } from "src/wrapper/server";
import { useDownloadState } from "src/wrapper/download";
import { useOptions } from "src/wrapper/options";
import { openUrl } from "@tauri-apps/plugin-opener";

import { SimpleUI } from "src/import/ui";
import * as axios from "src/axios/client";
import { useLibrary } from "src/wrapper/library";

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

  const servers = useServerManager((s) => s._servers);
  const serverCount = Object.values(servers).length;

  const downloads = useDownloadState((s) => s.active_download_progress);
  const downloadsCount = Object.values(
    Object.fromEntries(downloads.entries())
  ).length;

  const builds = useLibrary((l) => l.library);
  const buildsCount = Object.values(builds).length;

  console.log("drawer render", {
    serverCount,
    buildCount: buildsCount,
    downloadsCount,
  });

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
        label: "Competitive",
        icon: "IoTrophySharp",
        clicked: {
          type: "LINK",
          href: "/app/competitive",
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
          buildsCount > 0
            ? {
                colour_scheme: "grey",
                number: buildsCount,
                type: "NUMBER",
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
                number: serverCount,
                type: "NUMBER",
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
      // developer_mode
      //   ? {
      //       label: "Clans",
      //       icon: "IoPeopleSharp",
      //       clicked: {
      //         type: "LINK",
      //         href: "/app/clans",
      //       },
      //       colour_scheme: "purple",
      //     }
      //   : null,
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
        notification:
          downloadsCount > 0
            ? {
                colour_scheme: "grey",
                number: downloadsCount,
                type: "NUMBER",
              }
            : undefined,
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
