import { useLayoutEffect } from "react";
import { useApplicationInformation } from "src/wrapper/tauri";
import { useBannerManager } from "src/wrapper/banner";
import { useNavigate } from "@tanstack/react-router";
import { LauncherStage, useUserManager } from "src/wrapper/user";

import { check } from "@tauri-apps/plugin-updater";

const UpdateChecker = () => {
  const application = useApplicationInformation();
  const banners = useBannerManager();
  const userManager = useUserManager();
  const navigate = useNavigate();

  const queryUpdate = async () => {
    const result = await check();
    if (result == null) return console.log("[update] no update needed");

    console.log(
      `[update] ${result.version} from ${result.date} with notes ${result.body}`
    );

    application.setUpdateNeeded(result);

    banners.push({
      closable: false,
      colour: "blue",
      id: "update",
      text: `Version ${result.version} update available, click to navigate to the update page.`,
      link: "/update",
    });
  };

  useLayoutEffect(() => {
    (async () => await queryUpdate())();
  }, []);

  useLayoutEffect(() => {
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

  return null;
};

export default UpdateChecker;
