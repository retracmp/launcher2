import React from "react";

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
        className={`flex flex-row gap-1 p-1.5 ${props.className}`}
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
        className="text-neutral-300 font-plex text-[14px] text-base leading-[14px]"
        {...props}
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
      "bg-neutral-500/20 border-neutral-500/20 border-1 border-solid min-w-max p-1 rounded-xs cursor-pointer text-neutral-300 font-plex text-[14px] text-base hover:bg-neutral-500/30",
    ],
    red: [
      "bg-red-500/20 border-red-500/20 border-1 border-solid min-w-max p-1 rounded-xs cursor-pointer text-red-300 font-plex text-[14px] text-base hover:bg-red-500/30",
    ],
    green: [
      "bg-emerald-500/20 border-emerald-500/20 border-1 border-solid min-w-max p-1 rounded-xs cursor-pointer text-emerald-300 font-plex text-[14px] text-base hover:bg-emerald-500/30",
    ],
    blue: [
      "bg-blue-500/20 border-blue-500/20 border-1 border-solid min-w-max p-1 rounded-xs cursor-pointer text-blue-300 font-plex text-[14px] text-base hover:bg-blue-500/30",
    ],
    discord: [
      "bg-[#5865f2]/20 border-[#5865f2]/20 border-1 border-solid min-w-max p-1 rounded-xs cursor-pointer text-neutral-300 font-plex text-[14px] text-base hover:bg-[#5865f2]/30",
    ],
  };

  export const Button = (
    props: React.HTMLProps<HTMLButtonElement> & {
      colour: keyof typeof BUTTON_COLOURS;
    }
  ) => {
    return (
      <button
        {...props}
        type="button"
        className={`${BUTTON_COLOURS[props.colour][0]} ${props.className}`}
      >
        {props.children}
      </button>
    );
  };
}

export default UI;
