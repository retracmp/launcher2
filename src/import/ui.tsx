import { twJoin } from "tailwind-merge";
import { useLocation, useNavigate } from "@tanstack/react-router";

import * as Icons from "react-icons/io5";
import { motion } from "motion/react";
import { useMemo } from "react";
import NumberFlow from "@number-flow/react";

export namespace SimpleUI {
  export const DrawerState = {
    Disabled: 0,
    Collapsed: 1,
    Expanded: 2,
  };
  export const DrawerPosition = {
    Left: 0,
    Right: 1,
  };
  export type DrawerItemsOptions = {
    top: (Partial<DrawerItemOptions> | null)[];
    bottom: (Partial<DrawerItemOptions> | null)[];
  };
  export type DrawerOptions = {
    state: (typeof DrawerState)[keyof typeof DrawerState];
    position: (typeof DrawerPosition)[keyof typeof DrawerPosition];
    items: DrawerItemsOptions;
  };
  const DefaultDrawerOptions: DrawerOptions = {
    state: DrawerState.Expanded,
    position: DrawerPosition.Left,
    items: { top: [], bottom: [] },
  };
  export const Drawer = (props: Partial<DrawerOptions>) => {
    const options = { ...DefaultDrawerOptions, ...props };

    const starting_width = options.state === DrawerState.Disabled ? 0 : 48;
    const starting_padding =
      options.state === DrawerState.Disabled ? 0 : "0.375rem";

    const final_width =
      options.state === DrawerState.Disabled
        ? 0
        : options.state === DrawerState.Collapsed
        ? 48
        : 192;
    const final_padding =
      options.state === DrawerState.Disabled ? 0 : "0.375rem";

    const render_item = (
      item: Partial<DrawerItemOptions> | null,
      index: number
    ) => {
      if (item === null) return null;
      return (
        <DrawerItem
          {...DefaultDrawerItemOptions}
          {...item}
          drawer_state={options.state}
          key={index}
        />
      );
    };

    return (
      <motion.nav
        className={twJoin(
          "flex flex-col items-center gap-1 h-full min-h-max w-12 border-neutral-700/40 border-solid border-0 overflow-hidden pt-1.5 pb-1.5 backdrop-blur-[2px]",
          options.state !== DrawerState.Disabled && [
            options.position === DrawerPosition.Right &&
              "border-r-0 border-l-1 ml-auto",
            options.position === DrawerPosition.Left && "border-l-0 border-r-1",
          ]
        )}
        initial={{
          width: starting_width,
          padding: starting_padding,
        }}
        animate={{
          width: final_width,
          padding: final_padding,
        }}
        transition={
          options.state === DrawerState.Disabled
            ? {
                duration: 0.2,
              }
            : {
                type: "spring",
                stiffness: 200,
                damping: 21,
              }
        }
      >
        {options.items.top.map(render_item)}

        <s className="mt-auto" />

        {options.items.bottom.map(render_item)}

        {/* {options.children} */}
      </motion.nav>
    );
  };

  export type DrawerItemClickLink = {
    type: "LINK";
    href: string;
  };
  export type DrawerItemClickFunction = {
    type: "FUNCTION";
    fn: () => void;
  };
  export type DrawerItemNotification =
    | {
        type: "TEXT";
        colour_scheme: "blue" | "red" | "green" | "yellow" | "grey";
        text: string;
      }
    | {
        type: "NUMBER";
        colour_scheme: "blue" | "red" | "green" | "yellow" | "grey";
        number: number;
      };
  export type DrawerItemOptions = {
    icon: keyof typeof Icons;
    label: string;
    colour_scheme:
      | "red"
      | "green"
      | "blue"
      | "yellow"
      | "purple"
      | "pink"
      | "grey";
    clicked?: DrawerItemClickLink | DrawerItemClickFunction;
    notification?: DrawerItemNotification;
    drawer_state?: (typeof DrawerState)[keyof typeof DrawerState];
    custom_backdrop?: React.ReactNode;
    advert: boolean;
  };
  export const DefaultDrawerItemOptions: DrawerItemOptions = {
    icon: "IoAlertCircleSharp",
    label: "Item",
    colour_scheme: "grey",
    advert: false,
  };
  export const DrawerItem = (props: Partial<DrawerItemOptions>) => {
    const options = { ...DefaultDrawerItemOptions, ...props };

    const navigate = useNavigate();
    const location = useLocation();

    const active =
      options.clicked &&
      options.clicked.type === "LINK" &&
      location.pathname === options.clicked.href;

    const handleInteraction = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      if (!options.clicked) return;
      e.preventDefault();

      const handlers = {
        FUNCTION: (options.clicked as DrawerItemClickFunction).fn,
        LINK: () =>
          navigate({ to: (options.clicked as DrawerItemClickLink).href }),
      } as Record<typeof options.clicked.type, () => void>;
      handlers[options.clicked.type]();
    };

    const class_ = {
      grey: {
        base: "border-[#1f1f1f00] hover:not-data-[status=active]:bg-neutral-700/10 hover:not-data-[status=active]:border-neutral-700/[15%] text-neutral-400",
        active:
          "bg-neutral-700/20 bg-opacity-50 border-neutral-700/40 text-white",
      },
      red: {
        base: "border-[#1f1f1f00] hover:not-data-[status=active]:bg-red-400/5 hover:not-data-[status=active]:border-red-500/5 text-red-200",
        active: "bg-red-500/20 bg-opacity-50 border-red-500/40 text-white",
      },
      green: {
        base: "border-[#1f1f1f00] hover:not-data-[status=active]:bg-emerald-500/5 hover:not-data-[status=active]:border-emerald-500/10 text-emerald-400",
        active:
          "bg-emerald-500/20 bg-opacity-50 border-emerald-500/40 text-white",
      },
      blue: {
        base: "border-[#1f1f1f00] hover:not-data-[status=active]:bg-blue-500/5 hover:not-data-[status=active]:border-blue-500/10 text-blue-300",
        active: "bg-blue-500/20 bg-opacity-50 border-blue-500/40 text-white",
      },
      yellow: {
        base: "border-[#1f1f1f00] hover:not-data-[status=active]:bg-yellow-500/5 hover:not-data-[status=active]:border-yellow-500/10 text-yellow-200",
        active:
          "bg-yellow-500/20 bg-opacity-50 border-yellow-500/40 text-white",
      },
      pink: {
        base: "border-[#1f1f1f00] hover:not-data-[status=active]:bg-fuchsia-500/5 hover:not-data-[status=active]:border-fuchsia-500/10 text-fuchsia-300",
        active:
          "bg-fuchsia-500/20 bg-opacity-50 border-fuchsia-500/40 text-white",
      },
      purple: {
        base: "border-[#1f1f1f00] hover:not-data-[status=active]:bg-purple-500/5 hover:not-data-[status=active]:border-purple-500/10 text-purple-300",
        active:
          "bg-purple-500/20 bg-opacity-50 border-purple-500/40 text-white",
      },
    } as Record<typeof options.colour_scheme, { base: string; active: string }>;

    const Icon = Icons[options.icon];

    return (
      <button
        draggable={false}
        onClick={handleInteraction}
        data-status={active ? "active" : "inactive"}
        className={twJoin(
          "overflow-hidden relative flex gap-2 items-center justify-start min-w-9 w-full h-9 min-h-9 px-[9px] border-[1px] cursor-pointer transition-colors bg-[#ffffff00] hover:duration-[20ms] duration-150 hover:not-data-[status=active]:border-1 rounded-sm outline-none",
          class_[options.colour_scheme].base,
          active &&
            twJoin(
              class_[options.colour_scheme].active,
              "hover:none border-1 backdrop-blur-3xl bg-opacity-50"
            ),
          props.advert &&
            "border-[1px] border-solid not-data-[status=active]:border-red-500/5 bg-red-400/5"
        )}
      >
        {props.custom_backdrop ? props.custom_backdrop : null}

        {props.icon && <Icon className="min-w-4 min-h-4" />}

        <motion.span
          className="text-sm leading-[15px] min-w-fit mb-[1px]"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: options.drawer_state === DrawerState.Expanded ? 1 : 0,
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
        {options.drawer_state === DrawerState.Expanded && (
          <>
            {props.notification && props.notification.type === "NUMBER" && (
              <span className="absolute font-semibold p-1.5 pl-[0.35rem] py-2 bg-neutral-800 right-1 h-5 text-sm flex flex-row items-center justify-center rounded-[0.6rem]">
                <NumberFlow value={props.notification.number} />
              </span>
            )}

            {props.notification && props.notification.type === "TEXT" && (
              <span className="absolute p-1.5 py-2 bg-neutral-800 right-1 h-5 text-sm flex flex-row items-center justify-center rounded-[0.6rem]">
                {props.notification.text}
              </span>
            )}
          </>
        )}
      </button>
    );
  };

  export type FallingElementsOptions = {
    element: React.ElementType;
    density: number;
  };
  export const DefaultFallingElementsOptions: FallingElementsOptions = {
    element: () => <></>,
    density: 50,
  };
  export const FallingElements = (props: Partial<FallingElementsOptions>) => {
    const options = { ...DefaultFallingElementsOptions, ...props };
    const Element = options.element;

    const rendered = useMemo(() => {
      return Array.from({ length: options.density }).map((_, idx) => (
        <Element key={idx} {...props} />
      ));
    }, []);

    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {rendered}
      </div>
    );
  };

  export type FallingElementContainersOptions = {
    element: React.ElementType;
    size_scale_min: number;
    size_scale_max: number;
  };
  export const DefaultFallingElementContainersOptions: FallingElementContainersOptions =
    {
      element: () => <></>,
      size_scale_min: 1,
      size_scale_max: 1,
    };
  export const FallingElementContainer = (
    props: Partial<FallingElementContainersOptions>
  ) => {
    const options = { ...DefaultFallingElementContainersOptions, ...props };
    const Element = options.element;

    const randomised = useMemo(() => {
      const size =
        Math.random() * options.size_scale_max + options.size_scale_min;

      const left = Math.random() * 100;
      const duration = Math.random() * 5 + 15;
      const delay = Math.random() * -20;
      const rotation = Math.random() * 360 - 90;

      return { size, left, duration, delay, rotation };
    }, []);

    return (
      <motion.div
        initial={{
          y: "-10vh",
          rotate: 0,
        }}
        animate={{
          y: "110vh",
          rotate: randomised.rotation,
        }}
        transition={{
          duration: randomised.duration,
          delay: randomised.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: 0,
          left: `${randomised.left}%`,
          height: `${randomised.size}rem`,
          width: `${randomised.size}rem`,
          backdropFilter: "blur(1rem)",
          // backgroundImage: "url(/vbuck.png)",
          // backgroundSize: "cover",
          // backgroundPosition: "center",
          pointerEvents: "none",
          opacity: 0.2,
        }}
      >
        <Element />
      </motion.div>
    );
  };
}
