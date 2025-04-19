import { useNavigate } from "@tanstack/react-router";
import { useBannerManager } from "src/wrapper/banner";
import { useUserManager } from "src/wrapper/user";

import UI from "src/components/core/default";

const DeveloperPage = () => {
  const bannerManager = useBannerManager();
  const userManger = useUserManager();
  const navigate = useNavigate();

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
          <UI.Button
            onClick={() =>
              bannerManager.push({
                id: "slow",
                text: "Some services might be unavailable, please check back later.",
                colour: "yellow",
                closable: true,
              })
            }
            colour="invisible"
          >
            add closeable warning banner
          </UI.Button>

          <UI.Button
            onClick={() =>
              bannerManager.push({
                id: "notification",
                text: "The Lategame Cash Cup is now live! Hop in-game for a chance to win big!",
                colour: "pink",
                closable: false,
              })
            }
            colour="invisible"
          >
            add notification banner (would come from websocket to notify user of
            something)
          </UI.Button>

          <UI.Button
            onClick={() =>
              bannerManager.push({
                id: "websocket",
                text: "Websocket connection failed, please check your internet connection.",
                colour: "red",
                closable: false,
              })
            }
            colour="invisible"
          >
            websocket failue
          </UI.Button>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-1.5 border-b-[#2e2e2e] border-b-1 border-solid">
        <div className="flex flex-row gap-1 flex-wrap">
          <UI.Button
            onClick={() => {
              userManger.logout();
              navigate({ to: "/" });
            }}
            colour="invisible"
          >
            logut
          </UI.Button>
        </div>
      </div>
    </>
  );
};
export default DeveloperPage;
