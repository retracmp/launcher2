import { invoke as i } from "@tauri-apps/api/core";

const get_windows_version = async () => {
  const version = await i<number>("get_windows_version");
  return version;
};

const get_fortnite_version = async (path: string) => {
  const version = await i<string>("get_fortnite_version", { path });
  return version;
};

const invoke = {
  get_windows_version,
  get_fortnite_version,
};

export default invoke;
export { invoke };
