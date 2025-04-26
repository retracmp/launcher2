import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";

import DrawerItem, { SparklyDrawerItem } from "src/components/navigation/item";
import { motion } from "motion/react";

const Drawer = () => {
  const application = useApplicationInformation();
  const userManager = useUserManager();
  const options = useOptions();

  return (
    <motion.nav
      className="flex flex-col items-center gap-1 p-1.5 h-full w-12 border-r-[#2e2e2e] border-r-1 border-solid"
      initial={{ width: 48 }}
      animate={{ width: options.wide_drawer ? 192 : 48 }}
      transition={{ type: "spring", stiffness: 200, damping: 21 }}
    >
      {!userManager.access() ? <EmptyRoutes /> : <AuthenticatedRoutes />}

      {application.dev && (
        <DrawerItem
          path="/developer"
          icon="IoConstructSharp"
          label="Developer"
        />
      )}
    </motion.nav>
  );
};

const EmptyRoutes = () => {
  return (
    <>
      <DrawerItem path="/" icon="IoLockClosedSharp" label="Login" />
    </>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <>
      <DrawerItem path="/app/home" icon="IoHomeSharp" label="Home" />
      <DrawerItem path="/app/shop" icon="IoPricetagsSharp" label="Shop" />
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
      <DrawerItem path="/app/status" icon="IoPulseSharp" label="Status" />
      <SparklyDrawerItem
        path="/app/store"
        icon="IoSparklesSharp"
        label="Store"
        colour="yellow"
      />

      <s className="mt-auto" />

      <DrawerItem
        path="/app/settings"
        icon="IoSettingsSharp"
        label="Settings"
      />
    </>
  );
};

export default Drawer;
