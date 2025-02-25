import { create } from "zustand";

type ApplicationInformation = {
  name: string;
  version: string;

  load(name: string, version: string): void;
};

export const useApplicationInformation = create<ApplicationInformation>()(
  (set) => ({
    name: "Retrac",
    version: "0.1.0",
    load: (name, version) => set({ name, version }),
  })
);
