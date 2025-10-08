import { twJoin } from "tailwind-merge";
import { motion } from "motion/react";

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
  export type DrawerOptions = {
    state: (typeof DrawerState)[keyof typeof DrawerState];
    position: (typeof DrawerPosition)[keyof typeof DrawerPosition];
    children?: React.ReactNode;
  };
  const DefaultDrawerOptions: DrawerOptions = {
    state: DrawerState.Expanded,
    position: DrawerPosition.Left,
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

    return (
      <motion.nav
        className={twJoin(
          "flex flex-col items-center gap-1 h-full w-12 border-r-neutral-700/40 border-solid border-0 overflow-hidden pt-1.5 pb-1.5 backdrop-blur-[2px]",
          options.state !== DrawerState.Disabled && [
            options.position === DrawerPosition.Right &&
              "border-r-0 border-l-1",
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
        {props.children}
      </motion.nav>
    );
  };
}
