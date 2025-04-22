import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";

import DrawerItem, { SparklyDrawerItem } from "src/components/navigation/item";

const Drawer = () => {
  const application = useApplicationInformation();
  const userManager = useUserManager();

  return (
    <nav className="flex flex-col items-center gap-1 p-1.5 h-full w-12 border-r-[#2e2e2e] border-r-1 border-solid">
      {!userManager.access() ? <EmptyRoutes /> : <AuthenticatedRoutes />}

      {application.dev && (
        <DrawerItem
          path="/developer"
          icon="IoConstructSharp"
          label="developer"
        />
      )}
    </nav>
  );
};

const EmptyRoutes = () => {
  return (
    <>
      <DrawerItem path="/" icon="IoLockClosedSharp" label="login" />
    </>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <>
      <DrawerItem path="/app/home" icon="IoHomeSharp" label="home" />
      <DrawerItem path="/app/shop" icon="IoPricetagsSharp" label="shop" />
      <DrawerItem
        path="/app/library"
        icon="IoFileTrayFullSharp"
        label="library"
      />
      <DrawerItem path="/app/servers" icon="IoPulseSharp" label="servers" />
      <DrawerItem
        path="/app/leaderboard"
        icon="IoTrophySharp"
        label="leaderboard"
      />
      <SparklyDrawerItem
        path="/app/donate"
        icon="IoSparklesSharp"
        label="donate"
        colour="yellow"
      />

      <s className="mt-auto" />

      <DrawerItem
        path="/app/settings"
        icon="IoSettingsSharp"
        label="settings"
      />
    </>
  );
};

export default Drawer;
