import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";

import UI from "src/components/core/default";
import {
  BooleanOption,
  FileOption,
  NumberOption,
  StringOption,
} from "src/components/routes/app/settings/option";
import React from "react";
import { IoLogOutSharp } from "react-icons/io5";

const SettingsPage = () => {
  const application = useApplicationInformation();
  const user = useUserManager();
  const options = useOptions();

  return (
    <>
      <InvisibleItem className="text-blue-300" />
      <InvisibleItem className="text-orange-300" />
      <InvisibleItem className="text-purple-300" />
      <InvisibleItem className="text-red-300" />
      <InvisibleItem className="text-pink-300" />

      <div className="flex flex-col gap-1.5 p-2.5 border-[#2e2e2e] border-b-[1px] border-solid pb-[0.85rem]">
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">
            Settings & Options
          </UI.H1>
          <UI.P className="text-neutral-400">
            Customize your Retrac experience here.
          </UI.P>
        </div>
      </div>

      <div className="relative flex flex-col gap-2 p-2.5 border-[#2e2e2e] border-b-[1px] border-solid py-[0.85rem]">
        <UI.P className="text-neutral-500 absolute top-[-0.5rem] bg-neutral-900 px-1">
          Network
        </UI.P>

        <BooleanOption
          title="Auto Download"
          description={
            <>
              Any new content patches will be downloaded and installed{" "}
              <b>automatically</b>.
            </>
          }
          state={options.auto_download}
          set={options.set_auto_download}
          icon="IoCodeDownloadSharp"
          colour="blue"
        />

        <FileOption
          title="Content Directory"
          description={
            <>
              The path that all builds will be <b>downloaded</b> into.
            </>
          }
          state={options.content_directory}
          set={options.set_content_directory}
          icon="IoFolderOpenSharp"
          colour="orange"
        />
      </div>

      <div className="relative flex flex-col gap-2 p-2.5 border-[#2e2e2e] border-b-[1px] border-solid py-[0.85rem]">
        <UI.P className="text-neutral-500 absolute top-[-0.5rem] bg-neutral-900 px-1">
          Gameplay Tweaks
        </UI.P>

        <BooleanOption
          title="Simple Edit"
          description={
            <>Edit at lightning speed, exactly like latest Fortnite.</>
          }
          state={options.simple_edit}
          set={options.set_simple_edit}
          icon="IoRocketSharp"
          colour="purple"
        />

        <BooleanOption
          title="Disable Pre-Edits"
          description={<>Prevent accidental pre-edits when building.</>}
          state={options.disable_pre_edits}
          set={options.set_disable_pre_edits}
          icon="IoGridSharp"
          colour="red"
        />

        <BooleanOption
          title="Reset on Release"
          description={
            <>Reset builds on the release of a key, improves editing speed.</>
          }
          state={options.reset_on_release}
          set={options.set_reset_on_release}
          icon="IoMapSharp"
          colour="pink"
        />
      </div>

      <div className="relative flex flex-col gap-2 p-2.5 border-[#2e2e2e] border-b-[1px] border-solid py-[0.85rem]">
        <UI.P className="text-neutral-500 absolute top-[-0.5rem] bg-neutral-900 px-1">
          Client Preferences
        </UI.P>

        <NumberOption
          title="Leaderboard Page Size"
          description={
            <>Changes how many players are shown on the leaderboard per page.</>
          }
          state={options.leaderboard_page_size}
          set={(num) => {
            options.set_leaderboard_page_size(Math.max(1, Math.min(num, 100)));
          }}
          icon="IoList"
          colour="purple"
        />

        <StringOption
          title="Theme"
          description={
            <>Show off style with colourful redesigns of the launcher!</>
          }
          state={""}
          set={() => {}}
          icon="IoColorPaletteSharp"
          colour="red"
        />
      </div>

      <div className="flex flex-col gap-1.5 p-2">
        <div className="relative flex flex-col w-[100%] overflow-hidden">
          <span className="text-xs font-[400] text-neutral-500">
            {application.name} {application.version} on Windows{" "}
            {application.windowsVersion}
          </span>
          <span className="text-xs font-[400] text-neutral-500 select-text">
            {user._user?.ID}
          </span>
        </div>

        <UI.Button
          colour="invisible"
          className="py-0 px-2 mt-auto z-10 w-min gap-0"
          onClick={() => user.logout()}
        >
          <IoLogOutSharp className="text-neutral-400 w-4 h-4" />
          <span className="text-neutral-400">Logout</span>
        </UI.Button>
      </div>
    </>
  );
};

const InvisibleItem = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`${props.className} min-w-0 max-w-0 min-h-0 max-h-0 hidden`}
    />
  );
};

export default SettingsPage;
