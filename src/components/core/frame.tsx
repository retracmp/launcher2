import { getCurrentWindow } from "@tauri-apps/api/window";
import { useApplicationInformation } from "src/wrapper/tauri";
import * as rr from "@tanstack/react-router";

import { IoCloseSharp, IoArrowBackSharp } from "react-icons/io5";
import Drawer from "src/components/navigation/drawer";
import BannerRenderer from "../banner/parent";

const Frame = () => {
  const application = useApplicationInformation();

  return (
    <main
      className="flex flex-row w-full h-full bg-neutral-900"
      data-tauri-drag-region
    >
      <Drawer />

      <div className="flex flex-1 flex-col">
        <nav
          className="flex items-center pl-1.5 w-full bg-[#191919] h-7 border-b-[#2e2e2e] border-b-1 border-solid"
          data-tauri-drag-region
        >
          <p
            className="text-neutral-300 font-plex text-[14px]  text-base"
            data-tauri-drag-region
          >
            {application.name}
          </p>
          <p
            className="ml-1 mt-[2px] min-w-max text-neutral-500 font-plex text-[11px] text-base"
            data-tauri-drag-region
          >
            build {application.version}
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

        <BannerRenderer />
        <rr.Outlet />
      </div>
    </main>
  );
};

export default Frame;
