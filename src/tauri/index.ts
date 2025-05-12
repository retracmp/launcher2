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
      });
      console.error("Error retrieving Fortnite version:", e);
      return null;
    }
  );
  return version;
};

const launch_retrac = async (
  options: LaunchOptions
): Promise<string | null> => {
  const result = await i<string>("launch_retrac", { options }).catch(
    (e: string) => {
      useBannerManager.getState().push({
        closable: true,
        colour: "red",
        id: "launch_error",
        text: `Launching failed with reason: ${e}`,
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
): Promise<string | null> => {
  const stack = new Error().stack;
  console.log("download_build", stack);

  const result = await i<string>("download_build", {
    manifestId,
    downloadPath,
  }).catch((e: string) => {
    useBannerManager.getState().push({
      closable: true,
      colour: "red",
      id: "download_error",
      text: `Downloading build failed with reason: ${e}`,
    });
    console.error("Error downloading build:", e);
    return null;
  });

  return result;
};

const invoke = {
  get_windows_version,
  get_fortnite_version,
  launch_retrac,
  download_build,
};

export default invoke;
export { invoke };
