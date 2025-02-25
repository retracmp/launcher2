import React from "react";
import { useBannerManager } from "src/wrapper/banner";

const DeveloperPage = () => {
  const bannerManager = useBannerManager();

  return (
    <>
      <div className="flex flex-col gap-1 p-1.5 border-b-[#2e2e2e] border-b-1 border-solid">
        <p className="text-neutral-300 font-plex text-[14px] text-base ">
          on this page, everything is either client sided or protected by the
          server. this does not show on production builds unless the account
          logged in is a developer.
        </p>
      </div>
      <div className="flex flex-col gap-1 p-1.5 border-b-[#2e2e2e] border-b-1 border-solid">
        <div className="flex flex-row gap-1 flex-wrap">
          <Button
            onClick={() =>
              bannerManager.push({
                id: "banner",
                text: "Some services might be unavailable, please check back later.",
                colour: "yellow",
                closable: true,
              })
            }
          >
            add closeable warning banner
          </Button>

          <Button
            onClick={() =>
              bannerManager.push({
                id: "notification",
                text: "The Lategame Cash Cup is now live! Hop in-game for a chance to win big!",
                colour: "pink",
                closable: false,
              })
            }
          >
            add notification banner (would come from websocket to notify user of
            something)
          </Button>
        </div>
      </div>
    </>
  );
};

type ButtonProps = {} & React.HTMLProps<HTMLButtonElement>;

const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      type="button"
      className={`bg-neutral-500/20 border-neutral-500/20 border-1 border-solid min-w-max p-1 rounded-xs cursor-pointer text-neutral-300 font-plex text-[14px] text-base hover:bg-neutral-500/30`}
    >
      {props.children}
    </button>
  );
};

export default DeveloperPage;
