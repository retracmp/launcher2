import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useApplicationInformation } from "src/wrapper/tauri";
import { LauncherStage, useUserManager } from "src/wrapper/user";
import * as rr from "@tanstack/react-router";

import { HiMinus } from "react-icons/hi";
import { IoCloseSharp, IoArrowBackSharp } from "react-icons/io5";
import UI from "src/components/core/default";
import Drawer from "src/components/navigation/drawer";
import BannerRenderer from "src/components/banner/parent";

const Frame = () => {
  const application = useApplicationInformation();
  const userManager = useUserManager();
  const navigate = rr.useNavigate();

  const show = userManager.access() || !userManager.loading();

  useEffect(() => {
    if (
      userManager._stage === LauncherStage.NoToken ||
      userManager._stage === LauncherStage.TestingToken
    ) {
      navigate({
        to: "/",
      });
    }

    if (userManager._stage === LauncherStage.AllGood) {
      navigate({
        to: "/home",
      });
    }
  }, [userManager._stage]);

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
            className="text-neutral-300 font-plex text-[14px] text-base"
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
            onClick={() => getCurrentWindow().minimize()}
          >
            <HiMinus className="text-neutral-400 w-[14px] h-[14px]" />
          </button>
          <button
            className="flex items-center justify-center w-9 h-full cursor-pointer hover:bg-[#2e2e2e] hover:bg-opacity-50"
            onClick={() => getCurrentWindow().close()}
          >
            <IoCloseSharp className="text-neutral-400" />
          </button>
        </nav>

        {userManager.access() && <BannerRenderer />}
        {show ? <rr.Outlet /> : <LoadingIndicator />}
      </div>
    </main>
  );
};

const LoadingIndicator = () => {
  return (
    <UI.ColBox>
      <UI.P>Please wait while we connect you to our services.</UI.P>
    </UI.ColBox>
  );
};

export default Frame;
