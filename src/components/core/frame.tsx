import { useLauncherSocket } from "src/sockets";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";
import { twJoin } from "tailwind-merge";
import * as rr from "@tanstack/react-router";

import { getCurrentWindow } from "@tauri-apps/api/window";
import { useLayoutEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";

import UI from "src/components/core/default";

import HoverManager from "src/components/core/hover";
import AuthoriseHandler from "src/components/core/authorise";
import UpdateChecker from "src/components/core/update";

import Drawer from "src/components/visual/navigation/drawer";
import BannerRenderer from "src/components/visual/banner/parent";
import FriendsList from "src/components/visual/navigation/friends";
import FallingSnow from "src/components/visual/snow";
import BackgroundGradient from "src/components//visual/background_gradient";
import BackgroundImage from "src/components/visual/background_image";
import WindowBar from "src/components/visual/navigation/window_bar";
import Windows10BorderFix from "../visual/border_fix";

const Frame = () => {
  const userManager = useUserManager();
  const options = useOptions();
  const navigate = useNavigate();
  const location = useLocation();

  const show = userManager.access() || !userManager.loading();

  useLayoutEffect(() => {
    const checkWindowLabel = async () => {
      try {
        const window = getCurrentWindow();
        if (
          window.label === "downloads" &&
          location.pathname !== "/downloads"
        ) {
          navigate({ to: "/downloads" });
        }
      } catch (error) {}
    };
    checkWindowLabel();
  }, [navigate, location.pathname]);

  return (
    <>
      <UpdateChecker />
      <AuthoriseHandler />
      <BackgroundGradient />
      <BackgroundImage />
      <Windows10BorderFix />

      <main
        className={twJoin(
          "flex flex-row w-full h-full max-w-[100dvw] max-h-[100dvh] overflow-hidden z-20",
          options.enable_background_image || options.background_gradient != ""
            ? "bg-neutral-900/20"
            : "bg-neutral-900"
        )}
        data-tauri-drag-region
      >
        {getCurrentWindow().label !== "downloads" && <Drawer />}
        <HoverManager />

        <FallingSnow />

        <div className="flex flex-1 flex-col max-w-full max-h-full overflow-hidden">
          <WindowBar />

          {getCurrentWindow().label !== "downloads" && <BannerRenderer />}

          <div className="flex flex-row flex-1 max-w-full max-h-full overflow-hidden">
            <div className="relative flex flex-col flex-1 max-w-full max-h-full overflow-hidden overflow-y-auto @container">
              {show ? <rr.Outlet /> : <LoadingIndicator />}
            </div>

            {show && getCurrentWindow().label !== "downloads" && (
              <FriendsList />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

const LoadingIndicator = () => {
  const user = useUserManager();
  const socket = useLauncherSocket();

  const cancelConnection = () => {
    user.logout();
    socket.disconnect();
  };

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
        onClick={() => cancelConnection()}
      >
        <span className="text-neutral-400 text-sm">Cancel</span>
      </UI.Button>
    </UI.RowBox>
  );
};

export default Frame;
