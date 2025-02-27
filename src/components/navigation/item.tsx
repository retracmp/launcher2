import * as rr from "@tanstack/react-router";
import * as Icons from "react-icons/io5";

type DrawerItemProps = {
  icon: keyof typeof Icons;
  label: string;
  path: string;
};

const DrawerItem = (props: DrawerItemProps) => {
  const Icon = Icons[props.icon];

  return (
    <rr.Link
      to={props.path as any}
      draggable={false}
      className="ditem flex items-center justify-center w-9 h-9 min-h-9 cursor-pointer hover:not-data-[status=active]:bg-[#1f1f1fa4] hover:not-data-[status=active]:border-1 hover:not-data-[status=active]:border-[#1f1f1fa4] rounded-xs text-neutral-400 border-solid"
      activeProps={{
        className:
          "bg-[#1f1f1f] bg-opacity-50 rounded-xs border-[#2e2e2e] hover:none border-1 text-white",
      }}
    >
      <Icon />
    </rr.Link>
  );
};

const colours = {
  red: [
    "ditem flex items-center justify-center w-9 h-9 min-h-9 cursor-pointer hover:not-data-[status=active]:bg-red-500/5 rounded-xs text-red-200",
    "bg-red-500/20 rounded-xs border-red-500/20 hover:none border-1 border-solid text-white",
  ],
  green: [
    "ditem flex items-center justify-center w-9 h-9 min-h-9 cursor-pointer hover:not-data-[status=active]:bg-emerald-500/5 rounded-xs text-emerald-200",
    "bg-emerald-500/20 rounded-xs border-emerald-500/20 hover:none border-1 border-solid text-white",
  ],
  blue: [
    "ditem flex items-center justify-center w-9 h-9 min-h-9 cursor-pointer hover:not-data-[status=active]:bg-blue-500/5 rounded-xs text-blue-200",
    "bg-blue-500/20 rounded-xs border-blue-500/20 hover:none border-1 border-solid text-white",
  ],
  yellow: [
    "ditem flex items-center justify-center w-9 h-9 min-h-9 cursor-pointer hover:not-data-[status=active]:bg-yellow-500/5 rounded-xs text-yellow-200",
    "bg-yellow-500/20 rounded-xs border-yellow-500/20 hover:none border-1 border-solid text-white",
  ],
  pink: [
    "ditem flex items-center justify-center w-9 h-9 min-h-9 cursor-pointer hover:not-data-[status=active]:bg-fuchsia-500/5 rounded-xs text-fuchsia-200",
    "bg-fuchsia-500/20 rounded-xs border-fuchsia-500/20 hover:none border-1 border-solid text-white",
  ],
  purple: [
    "ditem flex items-center justify-center w-9 h-9 min-h-9 cursor-pointer hover:not-data-[status=active]:bg-purple-500/5 rounded-xs text-purple-200",
    "bg-purple-500/20 rounded-xs border-purple-500/20 hover:none border-1 border-solid text-white",
  ],
} as const;

type SparklyDrawerItemProps = DrawerItemProps & {
  colour: keyof typeof colours;
};

const SparklyDrawerItem = (props: SparklyDrawerItemProps) => {
  const Icon = Icons[props.icon];

  return (
    <rr.Link
      to={props.path as any}
      draggable={false}
      className={colours[props.colour][0]}
      activeProps={{
        className: colours[props.colour][1],
      }}
      activeOptions={{ exact: true }}
    >
      <Icon />
    </rr.Link>
  );
};

export default DrawerItem;
export { SparklyDrawerItem };
