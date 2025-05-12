import { invoke as i } from "@tauri-apps/api/core";

const get_windows_version = async () => {
  const version = await i<number>("get_windows_version");
  return version;
};

const get_fortnite_version = async (path: string) => {
  const version = await i<string>("get_fortnite_version", { path });
  return version;
};

const launch_retrac = async (options: LaunchOptions) => {
  const result = await i<string>("launch_retrac", { options });
  return result;
};

const download_build = async (manifestId: string, downloadPath: string) => {
  const stack = new Error().stack;
  console.log("download_build", stack);

  const result = await i<string>("download_build", {
    manifestId,
    downloadPath,
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
