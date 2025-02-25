import { useApplicationInformation } from "src/wrapper/tauri";

import DrawerItem, { SparklyDrawerItem } from "src/components/navigation/item";

const Drawer = () => {
  const application = useApplicationInformation();

  return (
    <nav className="flex flex-col items-center gap-1 p-1.5 h-full w-12 border-r-[#2e2e2e] border-r-1 border-solid">
      <DrawerItem path="/" icon="IoHomeSharp" label="home" />
      <DrawerItem path="/shop" icon="IoPricetagsSharp" label="shop" />
      <DrawerItem path="/library" icon="IoFileTrayFullSharp" label="library" />
      <DrawerItem path="/servers" icon="IoPulseSharp" label="servers" />
      <DrawerItem
        path="/leaderboard"
        icon="IoTrophySharp"
        label="leaderboard"
      />
      <SparklyDrawerItem
        path="/donate"
        icon="IoSparklesSharp"
        label="donate"
        colour="yellow"
      />

      <s className="mt-auto" />

      {application.dev && (
        <DrawerItem
          path="/developer"
          icon="IoConstructSharp"
          label="developer"
        />
      )}
      <DrawerItem path="/settings" icon="IoSettingsSharp" label="settings" />
    </nav>
  );
};

export default Drawer;
