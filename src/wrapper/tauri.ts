import { Update } from "@tauri-apps/plugin-updater";
import { create } from "zustand";

type ApplicationInformation = {
  name: string;
  version: string;
  dev: boolean;
  windowsVersion: number;
  load(
    name: string,
    version: string,
    dev: boolean,
    windowsVersion: number
  ): void;

  updateNeeded: Update | null;
  setUpdateNeeded: (update: Update | null) => void;
};

export const useApplicationInformation = create<ApplicationInformation>()(
  (set) => ({
    name: "Retrac",
    version: "2.0.15",
    dev: false,
    windowsVersion: 0,
    load: (name, version, dev, windowsVersion) =>
      set(() => ({ name, version, dev, windowsVersion })),
    updateNeeded: null,
    setUpdateNeeded: (update) => set(() => ({ updateNeeded: update })),
  })
);
