import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useApplicationInformation } from "src/wrapper/tauri";
import { LauncherStage, useUserManager } from "src/wrapper/user";
import * as rr from "@tanstack/react-router";

import { HiMinus } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import UI from "src/components/core/default";

import Drawer from "src/components/navigation/drawer";
import BannerRenderer from "src/components/banner/parent";
import FriendsList from "../navigation/friends";

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
        to: "/app",
      });
    }
  }, [userManager._stage]);

  return (
    <main
      className="flex flex-row w-full h-full bg-neutral-900 max-w-[100dvw] max-h-[100dvh] overflow-hidden"
      data-tauri-drag-region
    >
      <Drawer />

      <div className="flex flex-1 flex-col max-w-full max-h-full overflow-hidden">
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
        <div className="flex flex-row flex-1 max-w-full max-h-full overflow-hidden">
          <div className="flex flex-col flex-1 max-w-full max-h-full overflow-hidden">
            {show ? <rr.Outlet /> : <LoadingIndicator />}
          </div>

          {userManager.access() && <FriendsList />}
        </div>
      </div>
    </main>
  );
};

const LoadingIndicator = () => {
  return (
    <UI.RowBox>
      <div className="flex p-1.5 border-1 border-solid border-[#2e2e2e] rounded-xs">
        <UI.LoadingSpinner />
      </div>
      <div className="flex p-1.5 border-1 border-solid border-[#2e2e2e] rounded-xs w-full">
        <UI.P>Please wait while we connect you to our services.</UI.P>
      </div>
    </UI.RowBox>
  );
};

export default Frame;
