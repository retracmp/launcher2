import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";

import DrawerItem, { SparklyDrawerItem } from "src/components/navigation/item";

const Drawer = () => {
  const application = useApplicationInformation();
  const userManager = useUserManager();

  return (
    <nav
      className="flex flex-col items-center gap-1 p-1.5 h-full w-12 border-r-[#2e2e2e] border-r-1 border-solid"
      // className="flex flex-col items-center gap-1 p-1.5 h-full w-42 border-r-[#2e2e2e] border-r-1 border-solid"
    >
      {!userManager.access() ? <EmptyRoutes /> : <AuthenticatedRoutes />}

      {application.dev && (
        <DrawerItem
          path="/developer"
          icon="IoConstructSharp"
          label="Developer"
        />
      )}
    </nav>
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
