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
import FriendsList from "src/components/navigation/friends";
import HoverManager from "src/components/core/hover";

const ENSURE_IMAGES_ARE_CACHED = [
  "/donate/carti.webp",
  "/donate/gamer.webp",
  "/donate/crystal.webp",
  "/donate/fncs.webp",
  "/donate/og.webp",
  "/donate/carti_big.jpg",
  "/donate/gamer_big.jpg",
  "/donate/crystal_big.jpg",
  "/donate/fncs_big.jpg",
  "/donate/og_big.jpg",
];

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
        to: "/app/home",
      });
    }
  }, [userManager._stage]);

  return (
    <main
      className="flex flex-row w-full h-full bg-neutral-900 max-w-[100dvw] max-h-[100dvh] overflow-hidden"
      data-tauri-drag-region
      style={
        application.windowsVersion >= 22000
          ? {}
          : {
              borderTop: "1px solid #303030",
              // backgroundImage: "url(/2596180.jpg)",
              // backgroundSize: "cover",
              // backgroundPosition: "center",
            }
      }
    >
      <Drawer />
      <HoverManager />

      {ENSURE_IMAGES_ARE_CACHED.map((image) => (
        <img
          key={image}
          src={image}
          className="w-0 min-w-0 max-w-0 h-0 min-h-0 max-h-0 overflow-hidden opacity-0"
          loading="lazy"
          style={{
            filter: "blur(1px)",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        />
      ))}

      <div className="flex flex-1 flex-col max-w-full max-h-full overflow-hidden">
        <nav
          className="flex items-center pl-1.5 w-full bg-neutral-700/10 h-7 border-neutral-700/40 border-b-1 border-solid"
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
            build {application.version}
          </p>
          <s className="ml-auto" />

          <button
            className="flex items-center justify-center w-9 h-full cursor-pointer border-neutral-700/40 hover:bg-opacity-50"
            onClick={() => getCurrentWindow().minimize()}
          >
            <HiMinus className="text-neutral-400 w-[14px] h-[14px]" />
          </button>
          <button
            className="flex items-center justify-center w-9 h-full cursor-pointer border-neutral-700/40 hover:bg-opacity-50"
            onClick={() => getCurrentWindow().close()}
          >
            <IoCloseSharp className="text-neutral-400" />
          </button>
        </nav>

        <BannerRenderer />
        <div className="flex flex-row flex-1 max-w-full max-h-full overflow-hidden">
          <div className="relative flex flex-col flex-1 max-w-full max-h-full overflow-hidden overflow-y-auto @container">
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
      <div className="flex p-1.5 border-1 border-solid border-neutral-700/40 rounded-xs">
        <UI.LoadingSpinner />
      </div>
      <div className="flex p-1.5 border-1 border-solid border-neutral-700/40 rounded-xs w-full">
        <UI.P className="text-neutral-500">
          Please wait while we connect you to our services.
        </UI.P>
      </div>
    </UI.RowBox>
  );
};

export default Frame;
