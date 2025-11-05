import { useState } from "react";
import { useBannerManager } from "src/wrapper/banner";
import { useOptions } from "src/wrapper/options";
import { useRetrac } from "src/wrapper/retrac";
import { useLibrary } from "src/wrapper/library";

import { SimpleUI } from "src/import/ui";
import {
  BooleanOption,
  FileOption,
  OptionGroup,
  StringOption,
} from "../../core/option";
import UI from "src/components/core/default";

const DeveloperPage = () => {
  const bannerManager = useBannerManager();
  const options = useOptions();
  const retrac = useRetrac();
  const library = useLibrary();

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">
            Developer Playground
          </UI.H1>
          <UI.P className="text-neutral-400">
            Here you can test out various components and settings for
            development purposes. Anything here is client sided and even if you
            have access here you cannot affect production data or use any admin
            features.
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup title="Content Options">
        <BooleanOption
          title="Do not check for outdated paks on launch"
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
      </OptionGroup>

      <OptionGroup title="Client Options">
        <BooleanOption
          title="Override the default client runtime"
          description={
            <>
              Use a custom client dll instead of the default one provided by
              retrac.
            </>
          }
          state={retrac.use_custom_dll_path}
          set={retrac.set_use_custom_dll_path}
          _animate
        />

        {retrac.use_custom_dll_path && (
          <FileOption
            title="Runtime path"
            description="Path to a custom client DLL to use instead of the default one."
            state={retrac.custom_dll_path}
            set={retrac.set_custom_dll_path}
            _file_extensions={["dll"]}
            _animate
          />
        )}
      </OptionGroup>

      <OptionGroup title="Authenticate Options">
        <BooleanOption
          title="Use a custom display name"
          description={
            <>
              Skip exchange code login and use a custom display name for testing
              purposes.
            </>
          }
          state={retrac.enable_override_password}
          set={retrac.set_enable_override_password}
          _animate
        />

        {retrac.enable_override_password && (
          <>
            <StringOption
              title="Display Name"
              description="The display name to use when logging in."
              state={retrac.override_password}
              set={(s) => {
                retrac.set_override_password(s);
                if (s === "") {
                  retrac.set_override_password("goaterik");
                }
              }}
              _animate
              icon="IoInformationCircleSharp"
              _string_placeholder="Display Name"
            />

            <UI.Button
              onClick={() =>
                library.launchBuild(
                  "++Fortnite+Release-14.40-CL-14550713",
                  retrac.override_password
                )
              }
              loadAfterClick
              loadAfterClickText="Loading"
              colour="green"
              className="p-2"
            >
              Launch as{" "}
              {retrac.enable_override_password
                ? retrac.override_password
                : "normal login"}
            </UI.Button>
          </>
        )}
      </OptionGroup>

      <OptionGroup title="UI Options">
        <div className="flex flex-row gap-2">
          <BooleanOption
            title="No Sidebar"
            description={<>Remove for debugging purposes</>}
            state={options.disable_drawer}
            set={options.set_disable_drawer}
            _animate
          />

          <BooleanOption
            title="All available widgets on home page"
            description={
              <>Show all widgets on the home page for testing layout.</>
            }
            state={retrac.show_all_widgets}
            set={retrac.set_show_all_widgets}
            _animate
          />
        </div>

        <BooleanOption
          title="Show colour examples"
          description={
            <>Show various colour schemes and blurred backgrounds for testing</>
          }
          state={showAdvanced}
          set={setShowAdvanced}
          icon="IoColorPaletteSharp"
          _animate
        />
      </OptionGroup>

      <OptionGroup _row>
        <UI.Button
          onClick={() => {
            library.launchBuild(
              "++Fortnite+Release-14.40-CL-14550713",
              "goaterik"
            );
            library.launchBuild(
              "++Fortnite+Release-14.40-CL-14550713",
              "frauderik"
            );
          }}
          colour="green"
          className="p-2"
        >
          Launch two instances
        </UI.Button>
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
          Add Lorem Banner
        </UI.Button>
      </OptionGroup>

      {showAdvanced && (
        <OptionGroup title="UI Components" _row>
          <SimpleUI.Drawer
            state={SimpleUI.DrawerState.Expanded}
            items={{
              top: [
                { label: "Grey", colour_scheme: "grey" },
                { label: "Red", colour_scheme: "red" },
                { label: "Blue", colour_scheme: "blue" },
                { label: "Green", colour_scheme: "green" },
                { label: "Yellow", colour_scheme: "yellow" },
                { label: "Pink", colour_scheme: "pink" },
                { label: "Purple", colour_scheme: "purple" },
              ],
              bottom: [],
            }}
          ></SimpleUI.Drawer>
          <div className="flex flex-col overflow-auto">
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
          </div>
          <SimpleUI.Drawer
            state={SimpleUI.DrawerState.Collapsed}
            position={SimpleUI.DrawerPosition.Right}
            items={{
              top: [
                { label: "Grey", colour_scheme: "grey" },
                { label: "Red", colour_scheme: "red" },
                { label: "Blue", colour_scheme: "blue" },
                { label: "Green", colour_scheme: "green" },
                { label: "Yellow", colour_scheme: "yellow" },
                { label: "Pink", colour_scheme: "pink" },
                { label: "Purple", colour_scheme: "purple" },
              ],
              bottom: [],
            }}
          ></SimpleUI.Drawer>
        </OptionGroup>
      )}
    </>
  );
};
export default DeveloperPage;
