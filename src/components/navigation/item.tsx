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
      className="flex items-center justify-center w-9 h-9 min-h-9 cursor-pointer hover:not-data-[status=active]:bg-[#1f1f1fa4] rounded-xs"
      activeProps={{
        className:
          "bg-[#1f1f1f] bg-opacity-50 rounded-xs border-[#2e2e2e] hover:none border-1 border-solid",
      }}
    >
      <Icon className="text-neutral-400" />
    </rr.Link>
  );
};

export default DrawerItem;
