import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";

import UI from "src/components/core/default";
import {
  IoCodeDownloadSharp,
  IoFolderOpenSharp,
  IoGridSharp,
  IoMapSharp,
} from "react-icons/io5";

const SettingsPage = () => {
  const application = useApplicationInformation();
  const user = useUserManager();

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

        <div className="relative flex flex-col p-2 py-1.5 gap-[0.1rem] w-[100%] bg-neutral-800/10 rounded-sm border-[#2e2e2e] border-1 border-solid overflow-hidden">
          <span className="flex flex-row items-center gap-1 font-[500] text-neutral-300 text-[1rem] leading-5">
            <IoCodeDownloadSharp className="text-blue-300" />
            Auto Download
          </span>
          <span className="text-sm font-[400] text-neutral-500 leading-4">
            Any new content patches will be downloaded and installed
            <b> automatically</b>.
          </span>
        </div>

        <div className="relative flex flex-col p-2 py-1.5 gap-[0.1rem] w-[100%] bg-neutral-800/10 rounded-sm border-[#2e2e2e] border-1 border-solid overflow-hidden">
          <span className="flex flex-row items-center gap-1 font-[500] text-neutral-300 text-[1rem] leading-5">
            <IoFolderOpenSharp className="text-orange-300" />
            Content Directory
          </span>
          <span className="text-sm font-[400] text-neutral-500 leading-4">
            The path that all builds will be <b>downloaded</b> into.
          </span>
        </div>

        <span></span>
      </div>

      <div className="relative flex flex-col gap-1.5 p-2.5 border-[#2e2e2e] border-b-[1px] border-solid pt-[0.75rem]">
        <UI.P className="text-neutral-500 absolute top-[-0.5rem] bg-neutral-900 px-1">
          Gameplay Tweaks
        </UI.P>

        <div className="relative flex flex-col p-2 py-1.5 gap-[0.1rem] w-[100%] bg-neutral-800/10 rounded-sm border-[#2e2e2e] border-1 border-solid overflow-hidden">
          <span className="flex flex-row items-center gap-1 font-[500] text-neutral-300 text-[1rem] leading-5">
            <IoGridSharp className="text-yellow-100" />
            Disable Pre-Edits
          </span>
          <span className="text-sm font-[400] text-neutral-500 leading-4">
            Prevent accidental pre-edits when building.
          </span>
        </div>

        <div className="relative flex flex-col p-2 py-1.5 gap-[0.1rem] w-[100%] bg-neutral-800/10 rounded-sm border-[#2e2e2e] border-1 border-solid overflow-hidden">
          <span className="flex flex-row items-center gap-1 font-[500] text-neutral-300 text-[1rem] leading-5">
            <IoMapSharp className="text-neutral-500" />
            Reset on Release
          </span>
          <span className="text-sm font-[400] text-neutral-500 leading-4">
            Reset builds on the release of a key, improves editing speed.
          </span>
        </div>
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
