import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";

import UI from "src/components/core/default";
import {
  BooleanOption,
  FileOption,
  NumberOption,
  StringOption,
  OptionGroup,
} from "src/components/routes/app/settings/option";
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
      <InvisibleItem className="text-teal-300" />
      <InvisibleItem className="text-green-300" />
      <InvisibleItem className="text-slate-300" />
      <InvisibleItem className="text-gray-300" />
      <InvisibleItem className="text-indigo-300" />
      <InvisibleItem className="text-neutral-300" />
      <InvisibleItem className="text-emerald-300" />
      <InvisibleItem className="text-lime-300" />
      <InvisibleItem className="text-rose-300" />
      <InvisibleItem className="text-violet-300" />

      {/* <div className="flex flex-col gap-1.5 p-2.5 border-[#2e2e2e] border-b-[1px] border-solid pb-[0.85rem]"> */}
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">
            Settings & Options
          </UI.H1>
          <UI.P className="text-neutral-400">
            Customize your Retrac experience here.
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup title="Network">
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

        <BooleanOption
          title="Limit Download Speed"
          description={
            <>Limit the download speed to a certain amount of bandwidth.</>
          }
          state={options.limit_download_speed}
          set={options.set_limit_download_speed}
        />

        {options.limit_download_speed && (
          <NumberOption
            title="Download Limit"
            description={
              <>
                The maximum amount of bandwidth that can be used for downloads.
              </>
            }
            state={options.megabyte_download_limit}
            set={options.set_megabyte_download_limit}
            _number_extra_text="MB/s"
            _number_min={0}
            _number_max={5120}
          />
        )}

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
      </OptionGroup>

      <OptionGroup title="Gameplay Tweaks">
        <BooleanOption
          title="Simple Edit"
          description={
            <>Edit at lightning speed, exactly like latest Fortnite.</>
          }
          state={options.simple_edit}
          set={options.set_simple_edit}
        />

        <BooleanOption
          title="Disable Pre-Edits"
          description={<>Prevent accidental pre-edits when building.</>}
          state={options.disable_pre_edits}
          set={options.set_disable_pre_edits}
        />

        <BooleanOption
          title="Reset on Release"
          description={
            <>Reset builds on the release of a key, improves editing speed.</>
          }
          state={options.reset_on_release}
          set={options.set_reset_on_release}
        />
      </OptionGroup>

      <OptionGroup title="Client Preferences" _last>
        <StringOption
          title="Theme"
          description={
            <>Show off style with colourful redesigns of the launcher!</>
          }
          state={""}
          set={() => {}}
          icon="IoColorPaletteSharp"
          colour="purple"
        />

        <BooleanOption
          title="Wide Sidebar"
          description={<>Makes the navigation drawer wider, showing labels.</>}
          state={options.wide_drawer}
          set={options.set_wide_drawer}
        />

        <BooleanOption
          title="Friends List"
          description={
            <>Show your friends and their activity on the right sidebar.</>
          }
          state={options.show_friends}
          set={options.set_show_friends}
        />

        <NumberOption
          title="Leaderboard Page Size"
          description={
            <>Changes how many players are shown on the leaderboard per page.</>
          }
          state={options.leaderboard_page_size}
          set={(num) => {
            options.set_leaderboard_page_size(Math.max(1, Math.min(num, 100)));
          }}
          _number_max={100}
          _number_min={1}
        />
      </OptionGroup>

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
