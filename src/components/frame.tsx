import { getCurrentWindow } from "@tauri-apps/api/window";

import {
  IoCloseSharp,
  IoArrowBackSharp,
  IoHomeSharp,
  IoDownloadSharp,
  IoFileTrayFullSharp,
  IoStatsChartSharp,
} from "react-icons/io5";

const Frame = () => {
  return (
    <main
      className="flex flex-row w-full h-full bg-neutral-900"
      data-tauri-drag-region
    >
      <nav className="flex flex-col items-center gap-1 p-1.5 h-full w-12 border-r-[#2e2e2e] border-r-1 border-solid">
        <button className="flex items-center justify-center w-9 h-9 cursor-pointer hover:bg-[#1f1f1f3f] rounded-xs">
          <IoHomeSharp className="text-neutral-400" />
        </button>

        {/* selected */}
        <button className="flex items-center justify-center w-9 h-9 cursor-pointer bg-[#1f1f1f] bg-opacity-50 rounded-xs border-[#2e2e2e] border-1 border-solid">
          <IoDownloadSharp className="text-neutral-300" />
        </button>

        <button className="flex items-center justify-center w-9 h-9 cursor-pointer hover:bg-[#1f1f1f3f] rounded-xs">
          <IoFileTrayFullSharp className="text-neutral-400" />
        </button>

        {/* selected */}
        <button className="flex items-center justify-center w-9 h-9 cursor-pointer">
          <IoStatsChartSharp className="text-neutral-400" />
        </button>
      </nav>

      <div className="flex flex-1 flex-col">
        <nav
          className="flex items-center pl-1.5 w-full bg-[#191919] h-7 border-b-[#2e2e2e] border-b-1 border-solid"
          data-tauri-drag-region
        >
          <p
            className="text-neutral-300 font-plex text-[14px] leading-[14px] text-base"
            data-tauri-drag-region
          >
            Retrac
          </p>
          <s className="ml-auto" />

          <button
            className="flex items-center justify-center w-9 h-full cursor-pointer hover:bg-[#2e2e2e] hover:bg-opacity-50"
            onClick={() => history.back()}
          >
            <IoArrowBackSharp className="text-neutral-400 w-[14px] h-[14px]" />
          </button>
          <button
            className="flex items-center justify-center w-9 h-full cursor-pointer hover:bg-[#2e2e2e] hover:bg-opacity-50"
            onClick={() => getCurrentWindow().close()}
          >
            <IoCloseSharp className="text-neutral-400" />
          </button>
        </nav>
      </div>
    </main>
  );
};

export default Frame;
