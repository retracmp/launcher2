import DrawerItem from "src/components/navigation/item";

const Drawer = () => {
  return (
    <nav className="flex flex-col items-center gap-1 p-1.5 h-full w-12 border-r-[#2e2e2e] border-r-1 border-solid">
      <DrawerItem path="/" icon="IoHomeSharp" label="home" />
      <DrawerItem path="/shop" icon="IoPricetagsSharp" label="shop" />
      <DrawerItem path="/library" icon="IoFileTrayFullSharp" label="library" />
      <DrawerItem
        path="/leaderboard"
        icon="IoTrophySharp"
        label="leaderboard"
      />
    </nav>
  );
};

export default Drawer;
