import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OptionsState = {
  auto_download: boolean;
  set_auto_download: (value: boolean) => void;

  advanced_download_view: boolean;
  set_show_advanced_download_view: (value: boolean) => void;

  limit_download_speed: boolean;
  set_limit_download_speed: (value: boolean) => void;

  megabyte_download_limit: number;
  set_megabyte_download_limit: (value: number) => void;

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

  disable_drawer: boolean;
  set_disable_drawer: (value: boolean) => void;

  show_friends: boolean;
  set_show_friends: (value: boolean) => void;

  leaderboard_page_size: number;
  set_leaderboard_page_size: (value: number) => void;

  tiled_builds: boolean;
  set_tiled_builds: (value: boolean) => void;

  launch_arguments: string;
  set_launch_arguments: (value: string) => void;

  custom_theme_colour: string;
  set_custom_theme_colour: (value: string) => void;

  enable_background_image: boolean;
  set_enable_background_image: (value: boolean) => void;

  background_image: string;
  set_background_image: (value: string) => void;
};

export const useOptions = create<OptionsState>()(
  persist(
    (set) => ({
      auto_download: true,
      set_auto_download: (value) => set(() => ({ auto_download: value })),

      advanced_download_view: false,
      set_show_advanced_download_view: (value) =>
        set(() => ({ advanced_download_view: value })),

      limit_download_speed: false,
      set_limit_download_speed: (value) =>
        set(() => ({ limit_download_speed: value })),

      megabyte_download_limit: 512,
      set_megabyte_download_limit: (value) =>
        set(() => ({ megabyte_download_limit: value })),

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

      wide_drawer: true,
      set_wide_drawer: (value) => set(() => ({ wide_drawer: value })),

      disable_drawer: false,
      set_disable_drawer: (value) => set(() => ({ disable_drawer: value })),

      show_friends: true,
      set_show_friends: (value) => set(() => ({ show_friends: value })),

      leaderboard_page_size: 10,
      set_leaderboard_page_size: (value) =>
        set(() => ({ leaderboard_page_size: value })),

      tiled_builds: false,
      set_tiled_builds: (value) => set(() => ({ tiled_builds: value })),

      launch_arguments: "",
      set_launch_arguments: (value) => set(() => ({ launch_arguments: value })),

      custom_theme_colour: "#4f4f4f",
      set_custom_theme_colour: (value) =>
        set(() => ({ custom_theme_colour: value })),

      enable_background_image: false,
      set_enable_background_image: (value) =>
        set(() => ({ enable_background_image: value })),

      background_image: "/bg2.jpg",
      set_background_image: (value) => set(() => ({ background_image: value })),
    }),
    {
      name: "options",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
