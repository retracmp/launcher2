import React, { useState } from "react";

namespace UI {
  export const Box = (
    props: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  ) => {
    return (
      <div
        className={`border-b-[#2e2e2e] border-b-1 border-solid ${props.className}`}
      >
        {props.children}
      </div>
    );
  };

  export const ColBox = (
    props: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  ) => {
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
        className={`text-neutral-300 font-plex text-[14px] text-base leading-[14px] min-w-fit ${props.className}`}
      />
    );
  };

  export const PNoCol = (
    props: {
      children: React.ReactNode;
    } & React.HTMLAttributes<HTMLParagraphElement>
  ) => {
    return (
      <p
        {...props}
        className={`font-plex text-[14px] text-base leading-[14px] min-w-fit ${props.className}`}
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
        className="text-neutral-300 font-plex text-[20px] text-base leading-[20px] font-[600] font-geist"
        {...props}
      />
    );
  };

  export const BUTTON_COLOURS = {
    neutral: [
      "bg-neutral-500/20 border-neutral-500/20 border-1 border-solid min-w-max p-0.5 rounded-xs cursor-pointer text-neutral-300 font-plex text-[14px] text-base hover:bg-neutral-500/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-neutral-500/1s0 cursor-not-allowed",
    ],
    red: [
      "bg-red-500/20 border-red-500/20 border-1 border-solid min-w-max p-0.5 rounded-xs cursor-pointer text-red-300 font-plex text-[14px] text-base hover:bg-red-500/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-red-500/20 cursor-not-allowed",
    ],
    green: [
      "bg-green-500/20 border-green-500/20 border-1 border-solid min-w-max p-0.5 rounded-xs cursor-pointer text-green-400 font-plex text-[14px] text-base hover:bg-green-500/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-green-500/20 cursor-not-allowed",
    ],
    blue: [
      "bg-blue-500/20 border-blue-500/20 border-1 border-solid min-w-max p-0.5 rounded-xs cursor-pointer text-blue-300 font-plex text-[14px] text-base hover:bg-blue-500/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-blue-500/20 cursor-not-allowed",
    ],
    discord: [
      "bg-[#5865f2]/20 border-[#5865f2]/20 border-1 border-solid min-w-max p-0.5 rounded-xs cursor-pointer text-neutral-300 font-plex text-[14px] text-base hover:bg-[#5865f2]/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-[#5865f2]/20 cursor-not-allowed",
    ],
    pink: [
      "bg-fuchsia-500/20 border-fuchsia-500/20 border-1 border-solid min-w-max p-0.5 rounded-xs cursor-pointer text-fuchsia-300 font-plex text-[14px] text-base hover:bg-fuchsia-500/30 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-fuchsia-500/20 cursor-not-allowed",
    ],
    invisible: [
      "bg-transparent border-neutral-500/20 border-1 border-solid min-w-max p-0.5 rounded-xs cursor-pointer text-neutral-300 font-plex text-[14px] text-base hover:bg-neutral-500/10 flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-neutral-500/20 cursor-not-allowed",
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
      <span className="flex flex-row w-min gap-[0.2rem] items-center justify-center">
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
}

export default UI;
