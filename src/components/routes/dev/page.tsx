import { useState } from "react";
import { useBannerManager } from "src/wrapper/banner";
import { useOptions } from "src/wrapper/options";
import { useRetrac } from "src/wrapper/retrac";
import { useLibrary } from "src/wrapper/library";
import { useNavigate } from "@tanstack/react-router";
import { useLauncherSocket } from "src/sockets";

import { SimpleUI } from "src/import/ui";
import {
  BooleanOption,
  FileOption,
  OptionGroup,
  SliderOption,
  StringOption,
} from "../../core/option";
import UI from "src/components/core/default";

const DeveloperPage = () => {
  const push = useBannerManager((s) => s.push);
  const options = useOptions();
  const socket = useLauncherSocket();
  const retrac = useRetrac();
  const navigate = useNavigate();
  const launch = useLibrary((s) => s.launchBuild);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const nav = (ib: string) =>
    navigate({
      to: ib,
    });

  const send_custom_message = (options: Object) => {
    if (!socket.socket) return;

    socket.send({
      id: "custom_socket_event",
      ...options,
    } as Omit<SocketUpEventDataFromType<"custom_socket_event">, "version">);
  };

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

      <SimpleUI.List
        title="hello world"
        foldable="start-open"
        direction="row"
      ></SimpleUI.List>

      <OptionGroup title="Other Pages" _row>
        <UI.Button
          onClick={() => nav("/downloads")}
          colour="invisible"
          className="p-2"
        >
          Downloads Page
        </UI.Button>
        <UI.Button
          onClick={() => nav("/app/editor")}
          colour="invisible"
          className="p-2"
        >
          Editor
        </UI.Button>
        <UI.Button
          onClick={() => nav("/app/clans")}
          colour="invisible"
          className="p-2"
        >
          Unreleased clans
        </UI.Button>
        <UI.Button
          onClick={() => nav("/app/external")}
          colour="invisible"
          className="p-2"
        >
          External login
        </UI.Button>
      </OptionGroup>

      {socket.socket && (
        <OptionGroup title="websocket" _row>
          <UI.Button
            onClick={() =>
              send_custom_message({
                gift: "GB_MakeGood",
              })
            }
            colour="invisible"
            className="p-2"
          >
            Nothing giftbox
          </UI.Button>
          <UI.Button
            onClick={() =>
              send_custom_message({
                gift: "GB_TournamentReward",
                gift_params: {
                  eventId: "Riot_Event",
                  eventWindowId: "Riot_Event_Window_1",
                  token: "",
                },
              })
            }
            colour="invisible"
            className="p-2"
          >
            Tournament Giftbox
          </UI.Button>
          <UI.Button
            onClick={() =>
              send_custom_message({
                product_id: "package.secret",
              })
            }
            colour="invisible"
            className="p-2"
          >
            Give yourself package
          </UI.Button>
          <UI.Button
            onClick={() =>
              send_custom_message({
                clear_purchased_bills: true,
              })
            }
            colour="invisible"
            className="p-2"
          >
            Clear Packages
          </UI.Button>
        </OptionGroup>
      )}

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
        <StringOption
          title="Custom Server"
          description="Change the backend server to make requests to. (requires restart)"
          state={retrac.override_client_url}
          set={(s) => {
            retrac.set_override_client_url(s);
          }}
          _animate
          icon="IoUmbrella"
          _string_placeholder="https://retrac.site"
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
                launch(
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
          title="UI examples"
          description={
            <>Stub ui examples to test without needing to be logged in</>
          }
          state={showAdvanced}
          set={setShowAdvanced}
          icon="IoColorPaletteSharp"
          _animate
        />
      </OptionGroup>

      <OptionGroup _row>
        <UI.Button
          onClick={async () => {
            launch("++Fortnite+Release-14.40-CL-14550713", "goaterik");
            await new Promise((res) => setTimeout(res, 5000));
            launch("++Fortnite+Release-14.40-CL-14550713", "frauderik");
          }}
          colour="green"
          className="p-2"
        >
          Launch two instances
        </UI.Button>
        <UI.Button
          onClick={() =>
            push({
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
      <OptionGroup title="Seasonal" _animate>
        <BooleanOption
          title="Enable Falling Snow"
          description={
            <>
              Christmas decorated launcher to get into the <b>merry spirit!</b>
            </>
          }
          state={options.enable_snow}
          set={options.set_enable_snow}
          icon="IoSnowSharp"
          _animate
        />
        <SliderOption
          title="Snow Particles"
          description={
            <>
              Adjust the number of visible snow particles at any one time,{" "}
              <b>lower if Graphics Usage is high!</b>
            </>
          }
          state={options.snow_particles}
          set={options.set_snow_particles}
          icon="IoResizeSharp"
          _slider_min={10}
          _slider_max={500}
          _slider_step={10}
        />
      </OptionGroup>

      {showAdvanced && (
        <>
          <OptionGroup title="Falling Snow">
            <div className="relative w-full h-40 bg-white/5 rounded-sm">
              <SimpleUI.FallingElements
                density={150}
                element={() => (
                  <SimpleUI.FallingElementContainer
                    element={() => (
                      <div className="w-full h-full bg-white rounded-full"></div>
                    )}
                    size_scale_min={0.1}
                    size_scale_max={0.5}
                  />
                )}
              />
            </div>
          </OptionGroup>

          <OptionGroup title="Falling Snow">
            <div className="relative w-full h-40 bg-white/5 rounded-sm">
              <SimpleUI.FallingElements
                density={150}
                element={() => (
                  <SimpleUI.FallingElementContainer
                    element={() => (
                      <div className="w-full h-full bg-white rounded-full"></div>
                    )}
                    size_scale_min={0.1}
                    size_scale_max={0.5}
                  />
                )}
              />
            </div>
          </OptionGroup>
        </>
      )}
    </>
  );
};
export default DeveloperPage;
