import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";

import UI from "src/components/core/default";
import {
  BooleanOption,
  StringOption,
} from "src/components/routes/app/settings/option";

const SettingsPage = () => {
  const application = useApplicationInformation();
  const user = useUserManager();
  const options = useOptions();

  return (
    <>
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

      <div className="relative flex flex-col gap-1.5 p-2.5 border-[#2e2e2e] border-b-[1px] border-solid pt-[0.85rem]">
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

        <StringOption
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

        <span></span>
      </div>

      <div className="relative flex flex-col gap-1.5 p-2.5 border-[#2e2e2e] border-b-[1px] border-solid pt-[0.75rem]">
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
      </div>
    </>
  );
};

export default SettingsPage;
