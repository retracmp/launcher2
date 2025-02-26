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
    return <Box {...props} className="flex flex-col gap-1 p-1.5" />;
  };

  export const RowBox = (
    props: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  ) => {
    return <Box {...props} className="flex flex-row gap-1 p-1.5" />;
  };

  export const P = (
    props: {
      children: React.ReactNode;
    } & React.HTMLAttributes<HTMLParagraphElement>
  ) => {
    return (
      <p
        className="text-neutral-300 font-plex text-[14px] text-base"
        {...props}
      />
    );
  };
}

export default UI;
