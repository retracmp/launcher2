import { create } from "zustand";

type ApplicationInformation = {
  name: string;
  version: string;
  dev: boolean;

  load(name: string, version: string, developer: boolean): void;
};

export const useApplicationInformation = create<ApplicationInformation>()(
  (set) => ({
    name: "Retrac",
    version: "0.1.0",
    dev: false,
    load: (name, version, developer) =>
      set(() => ({ name, version, dev: developer })),
  })
);
