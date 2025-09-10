import { useRef } from "react";
import { useOptions } from "src/wrapper/options";
import { useHover } from "src/wrapper/hover";

import * as rr from "@tanstack/react-router";
import * as Icons from "react-icons/io5";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";

type DrawerItemProps = {
  icon: keyof typeof Icons;
  label: string;
  path: string;

  opt_string?: string;
  opt_number?: number;
  opt_onlick?: () => void;
};

const DrawerItemBaseClassName =
  "ditem relative flex gap-2 items-center justify-start min-w-9 w-full h-9 min-h-9 px-[9px] border-[1px] border-[#1f1f1f00] cursor-pointer transition-colors hover:duration-50 duration-150";

const DrawerItem = (props: DrawerItemProps) => {
  const hover = useHover();
  const parentRef = useRef<HTMLAnchorElement>(null);

  const options = useOptions();
  const Icon = Icons[props.icon];

  const HoverComponent = () => {
    return (
      <div
        className="flex flex-row items-center p-1 px-2 rounded-[0.35rem] bg-[#181818] border-neutral-700/40 border-[1px] border-solid overflow-hidden"
        key={"a"}
      >
        <span className="text-sm leading-[15px] min-w-fit mb-[1px] text-neutral-300/90">
          {props.label}
        </span>
      </div>
    );
  };

  const onHoverEntered = () => {
    if (options.wide_drawer) return;
    hover.set(parentRef.current, <HoverComponent />, props.label, "RIGHT");
  };
  const onHoverExited = () => {
    if (options.wide_drawer) return;
    hover.close(props.label);
  };

  return (
    <rr.Link
      to={props.path as any}
      draggable={false}
      className={`${DrawerItemBaseClassName} hover:not-data-[status=active]:bg-neutral-700/10 hover:not-data-[status=active]:border-1 hover:not-data-[status=active]:border-neutral-700/[15%] rounded-sm text-neutral-400 border-solid overflow-hidden ease-linear hover:duration-50 duration-150`}
      activeProps={{
        className:
          "bg-neutral-700/20 bg-opacity-50 border-neutral-700/40 hover:none border-1 text-white backdrop-blur-3xl",
      }}
      ref={parentRef}
      activeOptions={{ exact: true }}
      onMouseEnter={onHoverEntered}
      onMouseLeave={onHoverExited}
      onClick={props.opt_onlick}
    >
      <Icon className="min-w-4 min-h-4" />

      <motion.span
        className="text-sm leading-[15px] min-w-fit mb-[1px]"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: options.wide_drawer ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
          type: "spring",
          stiffness: 200,
          damping: 22.5,
        }}
      >
        {props.label}
      </motion.span>

      {options.wide_drawer && props.opt_string && (
        <span className="absolute p-1.5 py-2 bg-neutral-800 right-1 h-5 text-sm flex flex-row items-center justify-center rounded-[0.6rem]">
          {props.opt_string}
        </span>
      )}

      {options.wide_drawer && props.opt_number && props.opt_number > 0 && (
        <span className="absolute font-semibold p-1.5 pl-[0.35rem] py-2 bg-neutral-800 right-1 h-5 text-sm flex flex-row items-center justify-center rounded-[0.6rem]">
          <NumberFlow value={props.opt_number} />
        </span>
      )}
    </rr.Link>
  );
};

const colours = {
  red: [
    "hover:not-data-[status=active]:bg-red-500/5 rounded-sm text-red-200",
    "bg-red-500/20 rounded-sm border-red-500/20 hover:none border-1 border-solid",
  ],
  green: [
    "hover:not-data-[status=active]:bg-emerald-500/5 rounded-sm text-emerald-200",
    "bg-emerald-500/20 rounded-sm border-emerald-500/20 hover:none border-1 border-solid",
  ],
  blue: [
    "hover:not-data-[status=active]:bg-blue-500/5 rounded-sm text-blue-200",
    "bg-blue-500/20 rounded-sm border-blue-500/20 hover:none border-1 border-solid",
  ],
  yellow: [
    "hover:not-data-[status=active]:bg-yellow-500/5 rounded-sm text-yellow-200",
    "bg-yellow-500/20 rounded-sm border-yellow-500/20 hover:none border-1 border-solid",
  ],
  pink: [
    "hover:not-data-[status=active]:bg-fuchsia-500/5 rounded-sm text-fuchsia-200",
    "bg-fuchsia-500/20 rounded-sm border-fuchsia-500/20 hover:none border-1 border-solid",
  ],
  purple: [
    "hover:not-data-[status=active]:bg-purple-500/5 rounded-sm text-purple-200",
    "bg-purple-500/20 rounded-sm border-purple-500/20 hover:none border-1 border-solid",
  ],
} as const;

type SparklyDrawerItemProps = DrawerItemProps & {
  colour: keyof typeof colours;
};

const SparklyDrawerItem = (props: SparklyDrawerItemProps) => {
  const hover = useHover();
  const parentRef = useRef<HTMLAnchorElement>(null);

  const Icon = Icons[props.icon];
  const options = useOptions();

  const HoverComponent = () => {
    return (
      <div className="flex flex-row items-center p-1 px-2 rounded-[0.35rem] bg-[#181818] border-neutral-700/40 border-[1px] border-solid overflow-hidden">
        <span className="text-sm leading-[15px] min-w-fit mb-[1px] text-neutral-300/90">
          {props.label}
        </span>
      </div>
    );
  };

  const onHoverEntered = () => {
    if (options.wide_drawer) return;
    hover.set(parentRef.current, <HoverComponent />, props.label, "RIGHT");
  };
  const onHoverExited = () => {
    if (options.wide_drawer) return;
    hover.close(props.label);
  };

  return (
    <rr.Link
      to={props.path as any}
      draggable={false}
      className={`${DrawerItemBaseClassName} ${colours[props.colour][0]}`}
      activeProps={{
        className: colours[props.colour][1],
      }}
      ref={parentRef}
      activeOptions={{ exact: true }}
      onMouseEnter={onHoverEntered}
      onMouseLeave={onHoverExited}
    >
      <Icon className="min-w-4 min-h-4" />

      <motion.span
        className="text-sm leading-[15px] min-w-fit mb-[1px]"
        initial={{
          opacity: options.wide_drawer ? 0 : 1,
        }}
        animate={{
          opacity: options.wide_drawer ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
          type: "spring",
          stiffness: 200,
          damping: 22.5,
        }}
      >
        {props.label}
      </motion.span>
    </rr.Link>
  );
};

export default DrawerItem;
export { SparklyDrawerItem };
