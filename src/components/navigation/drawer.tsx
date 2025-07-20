import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";
import { useServerManager } from "src/wrapper/server";
import { useDownloadState } from "src/wrapper/download";
import { useOptions } from "src/wrapper/options";

import DrawerItem, { SparklyDrawerItem } from "src/components/navigation/item";
import { motion } from "motion/react";
import { openUrl } from "@tauri-apps/plugin-opener";

const Drawer = () => {
  const application = useApplicationInformation();
  const userManager = useUserManager();
  const options = useOptions();

  return (
    <motion.nav
      className="flex flex-col items-center gap-1 h-full w-12 border-r-neutral-700/40 border-r-1 border-solid overflow-hidden pt-1.5 pb-1.5 backdrop-blur-[2px]"
      initial={{
        width: options.disable_drawer ? 0 : 48,
        padding: options.disable_drawer ? 0 : "0.375rem",
      }}
      animate={{
        width: options.disable_drawer ? 0 : options.wide_drawer ? 192 : 48,
        padding: options.disable_drawer ? 0 : "0.375rem",
      }}
      transition={
        options.disable_drawer
          ? {
              duration: 0.2,
            }
          : {
              type: "spring",
              stiffness: 200,
              damping: 21,
            }
      }
      style={
        options.disable_drawer
          ? {
              borderRightWidth: 0,
            }
          : {}
      }
    >
      {!userManager.access() ? <EmptyRoutes /> : <AuthenticatedRoutes />}

      {(application.dev || userManager.is_dev()) && (
        <>
          {/* <DrawerItem path="/app/editor" icon="IoCreate" label="Editor" /> */}
          <DrawerItem
            path="/developer"
            icon="IoConstructSharp"
            label="Developer"
          />
        </>
      )}
    </motion.nav>
  );
};

const EmptyRoutes = () => {
  const application = useApplicationInformation();

  return (
    <>
      <DrawerItem path="/" icon="IoLockClosedSharp" label="Welcome" />
      <DrawerItem
        path="/support"
        icon="IoAccessibilitySharp"
        label="Need Help?"
        opt_onlick={() => {
          openUrl("https://discord.gg/6sNFtW4Hva");
        }}
      />

      {application.updateNeeded != null && (
        <SparklyDrawerItem
          path="/update"
          icon="IoBuildSharp"
          label="Update"
          colour="blue"
        />
      )}
    </>
  );
};

const AuthenticatedRoutes = () => {
  const application = useApplicationInformation();

  const servers = useServerManager((s) => s._servers);
  const serverCount = Object.values(servers).length;

  const builds = useDownloadState((s) => s.active_download_progress);
  const buildCount = Object.values(Object.fromEntries(builds.entries())).length;

  return (
    <>
      <DrawerItem path="/app/home" icon="IoHomeSharp" label="Home" />
      {/* <DrawerItem path="/app/shop" icon="IoCartSharp" label="Shop" /> */}
      <DrawerItem
        path="/app/leaderboard"
        icon="IoTrophySharp"
        label="Leaderboard"
      />
      <DrawerItem
        path="/app/library"
        icon="IoFileTrayFullSharp"
        label="Library"
      />
      <DrawerItem
        path="/app/status"
        icon="IoPulseSharp"
        label="Matches"
        opt_number={serverCount > 0 ? serverCount : undefined}
      />

      {application.dev && (
        <SparklyDrawerItem
          path="/app/clans"
          icon="IoPeopleSharp"
          label="Clans"
          colour="purple"
        />
      )}

      <SparklyDrawerItem
        path="/app/store"
        icon="IoSparklesSharp"
        label="Donate"
        colour="yellow"
      />
      <DrawerItem
        path="/support"
        icon="IoAccessibilitySharp"
        label="Need Help?"
        opt_onlick={() => {
          openUrl("https://discord.gg/6sNFtW4Hva");
        }}
      />

      <s className="mt-auto" />

      {application.updateNeeded != null && (
        <SparklyDrawerItem
          path="/update"
          icon="IoBuildSharp"
          label="Update"
          colour="blue"
        />
      )}

      <DrawerItem
        path="/app/downloads"
        icon="IoArchiveSharp"
        label="Downloads"
        opt_number={buildCount > 0 ? buildCount : undefined}
      />
      <DrawerItem
        path="/app/settings"
        icon="IoSettingsSharp"
        label="Settings"
      />
    </>
  );
};

export default Drawer;
