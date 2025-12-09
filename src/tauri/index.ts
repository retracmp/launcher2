import { invoke as i } from "@tauri-apps/api/core";
import { useBannerManager } from "src/wrapper/banner";

const get_windows_version = async (): Promise<number | null> => {
  const version = await i<number>("get_windows_version").catch((e: string) => {
    useBannerManager.getState().push({
      closable: true,
      colour: "red",
      id: "launch_error",
      text: `Retrieving Windows version failed with reason: ${e}`,
    });
    console.error("Error retrieving Windows version:", e);
    return null;
  });
  return version;
};

const get_fortnite_version = async (path: string): Promise<string | null> => {
  const version = await i<string>("get_fortnite_version", { path }).catch(
    (e: string) => {
      useBannerManager.getState().push({
        closable: true,
        colour: "red",
        id: "launch_error",
        text: `Retrieving Fortnite version failed with reason: ${e}`,
        expireAfter: 5,
      });
      console.error("Error retrieving Fortnite version:", e);
      return null;
    }
  );
  return version;
};

const launch_retrac = async (
  options: LaunchOptions
): Promise<boolean | null> => {
  const result = await i<boolean>("launch_retrac", { options }).catch(
    (e: string) => {
      useBannerManager.getState().push({
        closable: true,
        colour: "red",
        id: "launch_error",
        text: `Launching failed with reason: ${e}`,
        expireAfter: 10,
      });
      console.error("Error launching Retrac:", e);
      return null;
    }
  );
  return result;
};

const download_build = async (
  manifestId: string,
  downloadPath: string
): Promise<boolean | null> => {
  const result = await i<boolean>("download_build", {
    manifestId,
    downloadPath,
  }).catch((e: string) => {
    if (e === "Another download is already in progress") return null;

    useBannerManager.getState().push({
      closable: true,
      colour: "red",
      id: "download_error",
      text: `Downloading build failed with reason: ${e}`,
      expireAfter: 10,
    });
    console.error("Error downloading build:", e);
    return null;
  });

  return result;
};

const delete_build = async (
  manifestId: string,
  downloadPath: string
): Promise<boolean | null> => {
  const result = await i<boolean>("delete_build", {
    manifestId,
    downloadPath,
  }).catch((e: string) => {
    if (e === "Another download is already in progress") return null;

    useBannerManager.getState().push({
      closable: true,
      colour: "red",
      id: "delete_build",
      text: `Deleting build failed with reason: ${e}`,
      expireAfter: 10,
    });
    console.error("Error downloading build:", e);
    return null;
  });

  return result;
};

const is_fortnite_running = async (): Promise<boolean | null> => {
  const result = await i<boolean>("is_fortnite_running", {}).catch(
    (e: string) => {
      console.error("is_fortnite_running error:", e);
      return null;
    }
  );

  return result;
};

const close_fortnite = async (): Promise<boolean | null> => {
  const result = await i<boolean>("close_fortnite", {}).catch((e: string) => {
    console.error("Error closing Fortnite:", e);
    return null;
  });

  return result;
};

const add_to_defender = async (path: string): Promise<boolean | null> => {
  const result = await i<boolean>("add_to_defender", { path }).catch(
    (e: string) => {
      useBannerManager.getState().push({
        closable: true,
        colour: "red",
        id: "defender_error",
        text: `Adding to Windows Defender failed with reason: ${e}`,
        expireAfter: 10,
      });
      console.error("Error adding to Windows Defender:", e);
      return null;
    }
  );
  return result;
};

const add_to_defender_multi = async (
  paths: string[],
  actionToPerformAfter: string = ""
): Promise<boolean | null> => {
  const result = await i<boolean>("add_to_defender_multi", {
    paths,
    actionToPerformAfter,
  }).catch((e: string) => {
    useBannerManager.getState().push({
      closable: true,
      colour: "red",
      id: "defender_error",
      text: `Adding to Windows Defender failed with reason: ${e}`,
      expireAfter: 5,
    });
    console.error("Error adding to Windows Defender:", e);
    return null;
  });
  return result;
};

const get_app_action = async (): Promise<string | null> => {
  const action = await i<string>("get_app_action").catch((e: string) => {
    useBannerManager.getState().push({
      closable: true,
      colour: "red",
      id: "action_error",
      text: `Retrieving app action failed with reason: ${e}`,
      expireAfter: 5,
    });
    console.error("Error retrieving app action:", e);
    return null;
  });
  return action;
};

const cancel_download = async (manifestId: string): Promise<boolean | null> => {
  const result = await i<boolean>("cancel_download", { manifestId }).catch(
    (e: string) => {
      useBannerManager.getState().push({
        closable: true,
        colour: "red",
        id: "cancel_error",
        text: `Cancelling download failed with reason: ${e}`,
        expireAfter: 5,
      });
      console.error("Error cancelling download:", e);
      return null;
    }
  );
  return result;
};

const open_downloads_window = async (): Promise<boolean | null> => {
  const result = await i<boolean>("open_downloads_window", {}).catch(
    (e: string) => {
      useBannerManager.getState().push({
        closable: true,
        colour: "red",
        id: "window_error",
        text: `Opening downloads window failed with reason: ${e}`,
        expireAfter: 5,
      });
      console.error("Error opening downloads window:", e);
      return null;
    }
  );
  return result;
};

const invoke = {
  get_windows_version,
  get_fortnite_version,
  launch_retrac,
  download_build,
  delete_build,
  is_fortnite_running,
  close_fortnite,
  add_to_defender,
  add_to_defender_multi,
  get_app_action,
  cancel_download,
  open_downloads_window,
};

export default invoke;
export { invoke };
