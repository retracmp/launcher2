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

  wide_drawer: boolean;
  set_wide_drawer: (value: boolean) => void;

  show_friends: boolean;
  set_show_friends: (value: boolean) => void;

  leaderboard_page_size: number;
  set_leaderboard_page_size: (value: number) => void;
};

export const useOptions = create<OptionsState>()(
  persist(
    (set) => ({
      auto_download: true,
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

      wide_drawer: false,
      set_wide_drawer: (value) => set(() => ({ wide_drawer: value })),

      show_friends: true,
      set_show_friends: (value) => set(() => ({ show_friends: value })),

      leaderboard_page_size: 10,
      set_leaderboard_page_size: (value) =>
        set(() => ({ leaderboard_page_size: value })),
    }),
    {
      name: "options",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
