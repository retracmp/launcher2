import { useLayoutEffect } from "react";
import { useApplicationInformation } from "src/wrapper/tauri";
import { useBannerManager } from "src/wrapper/banner";

import { check } from "@tauri-apps/plugin-updater";

const UpdateChecker = () => {
  const application = useApplicationInformation();
  const banners = useBannerManager();

  const queryUpdate = async () => {
    // application.setUpdateNeeded({
    //   available: true,
    //   currentVersion: "2.0.0",
    //   version: "2.2.1",
    // } as any);

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

  return null;
};

export default UpdateChecker;
