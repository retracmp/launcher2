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
};

export const useApplicationInformation = create<ApplicationInformation>()(
  (set) => ({
    name: "Retrac",
    version: "0.2.0",
    dev: false,
    windowsVersion: 0,
    load: (name, version, dev, windowsVersion) =>
      set(() => ({ name, version, dev, windowsVersion })),
  })
);
