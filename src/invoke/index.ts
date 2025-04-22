import { invoke as i } from "@tauri-apps/api/core";

const get_windows_version = async () => {
  const version = await i<number>("get_windows_version");
  return version;
};

const invoke = {
  get_windows_version,
};

export default invoke;
export { invoke };
