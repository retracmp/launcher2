import { useNavigate } from "@tanstack/react-router";
import { useBannerManager } from "src/wrapper/banner";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";

import UI from "src/components/core/default";
import {
  BooleanOption,
  OptionGroup,
  StringOption,
} from "../app/settings/option";

const DeveloperPage = () => {
  const bannerManager = useBannerManager();
  const userManger = useUserManager();
  const navigate = useNavigate();
  const options = useOptions();

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
            className="p-2"
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
            className="p-2"
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
            className="p-2"
            colour="invisible"
          >
            websocket failue
          </UI.Button>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-1.5 border-b-[#2e2e2e] border-b-1 border-solid mb-1">
        <div className="flex flex-row gap-1 flex-wrap">
          <UI.Button
            onClick={() => {
              userManger.logout();
              navigate({ to: "/" });
            }}
            className="p-2"
            colour="invisible"
          >
            logut
          </UI.Button>
        </div>
      </div>
      <OptionGroup title="opts" _first>
        <StringOption
          title="launch arguments"
          description="arguments to pass to the game on launch."
          state={options.launch_arguments}
          set={options.set_launch_arguments}
        />

        <BooleanOption
          title="No Sidebar"
          description={<>Remove for debugging purposes</>}
          state={options.disable_drawer}
          set={options.set_disable_drawer}
          _animate
        />
      </OptionGroup>

      <div className="relative m-2 w-96 min-h-20 bg-neutral-800 overflow-hidden">
        <div className="w-full h-full blur-[5r0em]">
          <div
            className="absolute w-24 h-24 top-0 left-0 bg-red-500 rounded-full"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          ></div>

          <div
            className="absolute w-28 h-24 bottom-0 right-0 bg-fuchsia-500 rounded-full"
            style={{
              transform: "translate(-50%, 50%)",
            }}
          ></div>
        </div>
      </div>

      <div className="relative m-2 w-96 min-h-20 bg-neutral-800 overflow-hidden">
        <div className="w-full h-full blur-[5r0em]">
          <div
            className="absolute w-[29%] h-[120%] top-0 left-0 bg-red-500 rounded-full"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          ></div>

          <div
            className="absolute w-[29%] h-[120%] bottom-0 right-0 bg-fuchsia-500 rounded-full"
            style={{
              transform: "translate(-50%, 50%)",
            }}
          ></div>
        </div>
      </div>

      <div className="relative m-2 w-20 min-h-20 bg-neutral-800 overflow-hidden">
        <div className="w-full h-full blur-[5r0em]">
          <div
            className="absolute w-24 h-24 top-0 left-0 bg-red-500 rounded-full"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          ></div>

          <div
            className="absolute w-28 h-24 bottom-0 right-0 bg-fuchsia-500 rounded-full"
            style={{
              transform: "translate(-50%, 50%)",
            }}
          ></div>
        </div>
      </div>

      <div className="relative m-2 w-20 min-h-20 bg-neutral-800 overflow-hidden">
        <div className="w-full h-full blur-[2rem]">
          <div
            className="absolute w-[29%] h-[120%] top-0 left-0 bg-red-500 rounded-full"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          ></div>

          <div
            className="absolute w-[29%] h-[120%] bottom-0 right-0 bg-fuchsia-500 rounded-full"
            style={{
              transform: "translate(-50%, 50%)",
            }}
          ></div>
        </div>
      </div>
    </>
  );
};
export default DeveloperPage;
