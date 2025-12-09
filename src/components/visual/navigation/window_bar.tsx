import { getCurrentWindow } from "@tauri-apps/api/window";
import { useApplicationInformation } from "src/wrapper/tauri";

import { HiMinus } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";

const WindowBar = () => {
  const application = useApplicationInformation();

  return (
    <nav
      className="flex items-center pl-2 w-full bg-neutral-700/10 h-8 border-neutral-700/40 border-b-1 border-solid"
      data-tauri-drag-region
    >
      <p
        className="text-neutral-300 font-plex text-[14px] text-base font-bold"
        data-tauri-drag-region
      >
        {application.name.toUpperCase()}
      </p>
      <p
        className="ml-1 mt-[2.5px] min-w-max text-neutral-500 font-plex text-[11px] text-base "
        data-tauri-drag-region
      >
        {application.version !== ""
          ? `build ${application.version}`
          : getCurrentWindow().label}
      </p>
      <s className="ml-auto" />

      <button
        className="flex items-center justify-center w-9 h-full bg-neutral-900/00 cursor-pointer border-neutral-700/40 hover:bg-neutral-700/10 duration-75"
        onClick={() => getCurrentWindow().minimize()}
      >
        <HiMinus className="text-neutral-400 w-[14px] h-[14px]" />
      </button>
      <button
        className="flex items-center justify-center w-9 h-full bg-neutral-900/00 cursor-pointer border-neutral-700/40 hover:bg-neutral-700/10 duration-75"
        onClick={() => getCurrentWindow().close()}
      >
        <IoCloseSharp className="text-neutral-400" />
      </button>
    </nav>
  );
};

export default WindowBar;
