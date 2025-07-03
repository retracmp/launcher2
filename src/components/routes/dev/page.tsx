import { useBannerManager } from "src/wrapper/banner";
import { useOptions } from "src/wrapper/options";
import { useRetrac } from "src/wrapper/retrac";

import UI from "src/components/core/default";
import { BooleanOption, OptionGroup, StringOption } from "../../core/option";
import invoke from "src/tauri";

const DeveloperPage = () => {
  const bannerManager = useBannerManager();
  const options = useOptions();
  const retrac = useRetrac();

  return (
    <>
      <OptionGroup _first>
        <UI.Button
          onClick={() =>
            invoke.add_to_defender(
              "C:\\Users\\User\\Documents\\fortnite\\++Fortnite+Release-14.40-CL-14550713-Windows"
            )
          }
          colour="invisible"
          className="p-2"
        >
          add defender
        </UI.Button>
      </OptionGroup>
      <OptionGroup _first>
        <UI.H1>dev</UI.H1>
        <p className="text-neutral-300 font-plex text-[14px] text-base ">
          on this page, everything is either client sided or protected by the
          server. this does not show on production builds unless the account
          logged in is a developer.
        </p>
      </OptionGroup>

      <OptionGroup title="opts">
        <UI.Button
          onClick={() =>
            bannerManager.push({
              id: "slow",
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              colour: "yellow",
              closable: true,
            })
          }
          colour="invisible"
          className="p-2"
        >
          test banner
        </UI.Button>

        <BooleanOption
          title="Do not download paks on launch"
          description={
            <>
              Mainly for zylox armoon and tev so they can test paks without
              fighting the launcher
            </>
          }
          state={retrac.do_not_download_paks}
          set={retrac.set_do_not_download_paks}
          _animate
        />

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

        <BooleanOption
          title="All wdigets on home page"
          description={<>test</>}
          state={retrac.show_all_widgets}
          set={retrac.set_show_all_widgets}
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
        <div className="w-full h-full">
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
