import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

namespace UI {
  export const Box = (
    props: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  ) => {
    if (props.children === null) return null;
    return (
      <div
        className={`border-neutral-700/40 border-b-1 border-solid ${props.className}`}
      >
        {props.children}
      </div>
    );
  };

  export const ColBox = (
    props: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  ) => {
    if (props.children === null) return null;
    return (
      <Box
        {...props}
        className={`flex flex-col gap-1 p-1.5 ${props.className}`}
      />
    );
  };

  export const RowBox = (
    props: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  ) => {
    if (props.children === null) return null;
    return (
      <Box
        {...props}
        className={`flex flex-row gap-1 p-1.5 ${props.className} @max-xl:flex-col`}
      />
    );
  };

  export const P = (
    props: {
      children: React.ReactNode;
    } & React.HTMLAttributes<HTMLParagraphElement>
  ) => {
    return (
      <p
        {...props}
        className={`text-neutral-300 font-plex text-sm leading-[15px] min-w-fit ${props.className}`}
      />
    );
  };

  export const H1 = (
    props: {
      children: React.ReactNode;
    } & React.HTMLAttributes<HTMLHeadingElement>
  ) => {
    return (
      <h1
        {...props}
        className={`text-neutral-300 font-plex text-[20px] leading-[20px] font-[650] font-geist ${props.className}`}
      />
    );
  };

  export const BUTTON_COLOURS = {
    neutral: [
      "bg-neutral-500/20 border-neutral-500/20 border-1 border-solid min-w-max p-0.5 py-1 rounded-sm cursor-pointer text-neutral-300 font-inter text-[14px] text-base hover:bg-neutral-500/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-neutral-500/1s0 disabled:cursor-not-allowed outline-none",
    ],
    red: [
      "bg-red-500/20 border-red-500/20 border-1 border-solid min-w-max p-0.5 py-1 rounded-sm cursor-pointer text-red-300 font-plex text-[14px] text-base hover:bg-red-500/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-red-500/20 disabled:cursor-not-allowed outline-none",
    ],
    green: [
      "bg-green-500/20 border-green-500/20 border-1 border-solid min-w-max p-0.5 py-1 rounded-sm cursor-pointer text-green-400 font-plex text-[14px] text-base hover:bg-green-500/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-green-500/20 disabled:cursor-not-allowed outline-none",
    ],
    blue: [
      "bg-blue-500/20 border-blue-500/20 border-1 border-solid min-w-max p-0.5 py-1 rounded-sm cursor-pointer text-blue-300 font-plex text-[14px] text-base hover:bg-blue-500/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-blue-500/20 disabled:cursor-not-allowed outline-none",
    ],
    discord: [
      "bg-[#5865f2]/20 border-[#5865f2]/20 border-1 border-solid min-w-max p-0.5 py-1 rounded-sm cursor-pointer text-neutral-300 font-plex text-[14px] text-base hover:bg-[#5865f2]/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-[#5865f2]/20 disabled:cursor-not-allowed outline-none",
    ],
    pink: [
      "bg-fuchsia-500/20 border-fuchsia-500/20 border-1 border-solid min-w-max p-0.5 py-1 rounded-sm cursor-pointer text-fuchsia-300 font-plex text-[14px] text-base hover:bg-fuchsia-500/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-fuchsia-500/20 disabled:cursor-not-allowed outline-none",
    ],
    invisible: [
      "bg-transparent border-neutral-500/20 border-1 border-solid min-w-max p-0.5 py-1 rounded-sm cursor-pointer text-neutral-300 font-plex text-[14px] text-base hover:bg-neutral-500/10 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-neutral-500/20 disabled:cursor-not-allowed outline-none",
    ],
  };

  export const Button = (
    props: React.HTMLProps<HTMLButtonElement> & {
      colour: keyof typeof BUTTON_COLOURS;
      loadAfterClick?: boolean;
      loadAfterClickText?: string;
    }
  ) => {
    const normalReactProps = { ...props };
    delete normalReactProps.loadAfterClick;
    delete normalReactProps.loadAfterClickText;

    const clicked = useState(false);
    return (
      <button
        {...normalReactProps}
        onClick={(e) => {
          try {
            clicked[1](true);
            props.onClick && props.onClick(e);
            setTimeout(() => clicked[1](false), 10000);
          } catch (error) {
            clicked[1](false);
          }
        }}
        type="button"
        className={`${BUTTON_COLOURS[props.colour][0]} ${props.className}`}
        disabled={(props.loadAfterClick && clicked[0]) || props.disabled}
      >
        {props.loadAfterClick && clicked[0] ? (
          <>
            <LoadingSpinner />
            {props.loadAfterClickText}
          </>
        ) : (
          props.children
        )}
      </button>
    );
  };

  export const LoadingSpinner = () => {
    return (
      <span className="flex flex-row w-min gap-[0.2rem] items-center justify-center z-2">
        {[...Array(3)].map((_, i) => (
          <LoadingBall key={i} i={i} />
        ))}
      </span>
    );
  };

  type LoadingBallProps = {
    i: number;
  };

  const LoadingBall = (props: LoadingBallProps) => {
    return (
      <span
        className="animate-pulse w-1.5 h-1.5 bg-neutral-300/20 rounded-full"
        style={{
          animationDelay: `${props.i * 0.2}s`,
        }}
      ></span>
    );
  };
  export const LoadingSpinnerOpaque = () => {
    return (
      <span className="flex flex-row w-min gap-[0.2rem] items-center justify-center z-2">
        {[...Array(3)].map((_, i) => (
          <LoadingBallOpaque key={i} i={i} />
        ))}
      </span>
    );
  };

  const LoadingBallOpaque = (props: LoadingBallProps) => {
    return (
      <span
        className="animate-pulse w-1.5 h-1.5 bg-neutral-400 rounded-full"
        style={{
          animationDelay: `${props.i * 0.2}s`,
        }}
      ></span>
    );
  };

  interface MinDurationProps {
    visible: boolean;
    minDuration: number;
    children: React.ReactNode;
  }

  export const MinDuration = ({
    visible,
    minDuration,
    children,
  }: MinDurationProps) => {
    const [shouldRender, setShouldRender] = useState(visible);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    useEffect(() => {
      let timer: number;

      if (visible) {
        setShouldRender(true);
        setMinTimeElapsed(false);
        timer = setTimeout(() => setMinTimeElapsed(true), minDuration);
      } else if (!minTimeElapsed) {
        timer = setTimeout(() => setShouldRender(false), minDuration);
      } else {
        setShouldRender(false);
      }

      return () => clearTimeout(timer);
    }, [visible]);

    return (
      <AnimatePresence>
        {" "}
        {shouldRender ? <>{children}</> : null}
      </AnimatePresence>
    );
  };

  type ButtonProps = {
    children: React.ReactNode;
    on_click: () => void;
    colour: "green" | "red" | "blue" | "invisible";
    tooltip?: string;
    _last?: boolean;
    disabled?: boolean;
  };

  export const RowButton = (props: ButtonProps) => {
    const colour = (
      {
        blue: "not-[:disabled]:hover:bg-blue-400/30 text-neutral-600 not-[:disabled]:hover:text-blue-200",
        green:
          "not-[:disabled]:hover:bg-green-400/30 text-neutral-600 not-[:disabled]:hover:text-green-200",
        red: "not-[:disabled]:hover:bg-red-400/30 text-neutral-600 not-[:disabled]:hover:text-red-200",
        invisible: "not-[:disabled]:hover:bg-neutral-700/10 text-neutral-400",
      } as const
    )[props.colour];

    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <>
        <button
          className={`aspect-square min-w-max h-8 flex items-center justify-center p-1.5 bg-neutral-700/20 rounded-md disabled: ${
            props.disabled ? "cursor-not-allowed" : "cursor-pointer"
          } transition-all ${colour}`}
          onClick={props.on_click}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={props.disabled}
        >
          <motion.div
            className="absolute text-xs text-center pointer-events-none bg-neutral-800 p-0.5 px-1.5 min-w-max rounded-md backdrop-blur-md"
            initial={{ opacity: 0, y: -10, x: !props._last ? 0 : -20 }}
            animate={{
              opacity: showTooltip ? 1 : 0,
              y: showTooltip ? -30 : -20,
              x: !props._last ? 0 : -20,
            }}
          >
            {props.tooltip}
          </motion.div>
          {props.children}
        </button>
      </>
    );
  };
}

export default UI;
