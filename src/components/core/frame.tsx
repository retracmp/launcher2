import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useApplicationInformation } from "src/wrapper/tauri";
import { LauncherStage, useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";
import * as rr from "@tanstack/react-router";

import { HiMinus } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import UI from "src/components/core/default";

import Drawer from "src/components/navigation/drawer";
import BannerRenderer from "src/components/banner/parent";
import FriendsList from "src/components/navigation/friends";
import HoverManager from "src/components/core/hover";
import { SimpleUI } from "src/import/ui";

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
  const options = useOptions();

  const show = userManager.access() || !userManager.loading();

  useEffect(() => {
    if (application.updateNeeded) {
      navigate({
        to: "/update",
      });
      return;
    }

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
  }, [userManager._stage, application.updateNeeded]);

  return (
    <>
      {options.enable_background_image && (
        <div
          className="absolute w-[110%] h-[110%] opacity-20 pointer-events-none z-[-10000]"
          style={{
            backgroundImage: `url(${
              convertFileSrc(options.background_image) || "/bg2.jpg"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: `blur(${options.background_blur}rem)`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      )}

      {!options.enable_background_image &&
        options.background_gradient != "" && (
          <div
            className="absolute w-[110%] h-[110%] opacity-100 pointer-events-none z-[-10000]"
            style={{
              backgroundImage: `${options.background_gradient}`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: `blur(${options.background_blur}rem)`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        )}

      <main
        className={`flex flex-row w-full h-full ${
          options.enable_background_image || options.background_gradient != ""
            ? "bg-neutral-900/20"
            : "bg-neutral-900"
        } max-w-[100dvw] max-h-[100dvh] overflow-hidden z-20`}
        data-tauri-drag-region
        style={
          application.windowsVersion >= 22000
            ? {}
            : {
                borderTop: "1px solid #303030",
                // backgroundImage: "url(/c2s4_keyart.jpg)",
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
              build {application.version}
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

          <BannerRenderer />
          <div className="flex flex-row flex-1 max-w-full max-h-full overflow-hidden">
            {((): boolean => {
              const today = new Date();
              const year = today.getFullYear();
              const start = new Date(year, 11, 1);
              const end = new Date(year, 11, 31);
              return today >= start && today <= end;
            })() && (
              <SimpleUI.FallingElements
                density={150}
                element={() => (
                  <SimpleUI.FallingElementContainer
                    element={() => (
                      <div className="w-full h-full bg-white rounded-full"></div>
                    )}
                    size_scale_min={0.1}
                    size_scale_max={0.5}
                  />
                )}
              />
            )}

            <div className="relative flex flex-col flex-1 max-w-full max-h-full overflow-hidden overflow-y-auto @container">
              {show ? <rr.Outlet /> : <LoadingIndicator />}
            </div>

            {userManager.access() && <FriendsList />}
          </div>
        </div>
      </main>
    </>
  );
};

const LoadingIndicator = () => {
  const user = useUserManager();

  return (
    <UI.RowBox>
      <div className="flex p-2.5 border-1 border-solid border-neutral-700/40 rounded-xs">
        <UI.LoadingSpinner />
      </div>
      <div className="flex p-1.5 border-1 border-solid border-neutral-700/40 rounded-xs w-full">
        <UI.P className="text-neutral-500">
          Please wait while we connect you to our services.
        </UI.P>
      </div>
      <UI.Button
        colour="invisible"
        className="py-0 px-2 mt-auto z-10 w-min gap-0"
        onClick={() => user.logout()}
      >
        <span className="text-neutral-400 text-sm">Cancel</span>
      </UI.Button>
    </UI.RowBox>
  );
};

export default Frame;
