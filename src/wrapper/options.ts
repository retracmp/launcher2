import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OptionsState = {
  auto_download: boolean;
  set_auto_download: (value: boolean) => void;

  content_directory: string;
  set_content_directory: (value: string) => void;

  simple_edit: boolean;
  set_simple_edit: (value: boolean) => void;

  disable_pre_edits: boolean;
  set_disable_pre_edits: (value: boolean) => void;

  reset_on_release: boolean;
  set_reset_on_release: (value: boolean) => void;
};

export const useOptions = create<OptionsState>()(
  persist(
    (set) => ({
      auto_download: false,
      set_auto_download: (value) => set(() => ({ auto_download: value })),

      content_directory: "",
      set_content_directory: (value) =>
        set(() => ({ content_directory: value })),

      simple_edit: false,
      set_simple_edit: (value) => set(() => ({ simple_edit: value })),

      disable_pre_edits: false,
      set_disable_pre_edits: (value) =>
        set(() => ({ disable_pre_edits: value })),

      reset_on_release: false,
      set_reset_on_release: (value) => set(() => ({ reset_on_release: value })),
    }),
    {
      name: "options",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
