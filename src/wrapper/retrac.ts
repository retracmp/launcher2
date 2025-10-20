import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RetracState = {
  players_online: number;
  set_players_online: (players_online: number) => void;

  launcher_news: LauncherNewsItem[];
  set_launcher_news: (launcher_news: LauncherNewsItem[]) => void;

  events: LauncherEventItem[];
  set_events: (events: LauncherEventItem[]) => void;

  manifests: ManifestInformation[];
  set_manifests: (manifests: ManifestInformation[]) => void;

  auto_download_manifests: string[];
  set_auto_download_manifests: (manifests: string[]) => void;

  show_recent_matches: boolean;
  set_show_recent_matches: (show_recent_matches: boolean) => void;

  show_filters: boolean;
  set_show_filters: (show_filters: boolean) => void;

  show_news: boolean;
  set_show_news: (show_news: boolean) => void;

  selected_news_item: LauncherNewsItem | null;
  set_selected_news_item: (selected_news_item: LauncherNewsItem | null) => void;

  show_all_widgets: boolean;
  set_show_all_widgets: (show_all_widgets: boolean) => void;

  donation_message_popped: boolean;
  set_donation_message_popped: (donation_message_popped: boolean) => void;

  stop_auto_download_due_to_error: boolean;
  set_stop_auto_download_due_to_error: (stop: boolean) => void;

  do_not_download_paks: boolean;
  set_do_not_download_paks: (do_not_download_paks: boolean) => void;

  editing_order_of_library: boolean;
  set_editing_order_of_library: (editing: boolean) => void;

  use_custom_dll_path: boolean;
  set_use_custom_dll_path: (use_custom_dll_path: boolean) => void;

  custom_dll_path: string;
  set_custom_dll_path: (custom_dll_path: string) => void;

  enable_override_password: boolean;
  set_enable_override_password: (enable_override_password: boolean) => void;

  override_password: string;
  set_override_password: (override_password: string) => void;
};

export const useRetrac = create<RetracState>()(
  persist(
    (set) => ({
      players_online: 0,
      set_players_online: (players_online) => set({ players_online }),

      launcher_news: [],
      set_launcher_news: (launcher_news) => set({ launcher_news }),

      events: [],
      set_events: (events) => set({ events }),

      manifests: [],
      set_manifests: (manifests) => set({ manifests }),

      auto_download_manifests: [],
      set_auto_download_manifests: (manifests) =>
        set({ auto_download_manifests: manifests }),

      show_recent_matches: false,
      set_show_recent_matches: (show_recent_matches) =>
        set({ show_recent_matches }),

      show_filters: false,
      set_show_filters: (show_filters) => set({ show_filters }),

      show_news: false,
      set_show_news: (show_news) => set({ show_news }),

      selected_news_item: null,
      set_selected_news_item: (selected_news_item) =>
        set({ selected_news_item }),

      show_all_widgets: false,
      set_show_all_widgets: (show_all_widgets) => set({ show_all_widgets }),

      donation_message_popped: false,
      set_donation_message_popped: (donation_message_popped) =>
        set({ donation_message_popped }),

      stop_auto_download_due_to_error: false,
      set_stop_auto_download_due_to_error: (stop) =>
        set({ stop_auto_download_due_to_error: stop }),

      do_not_download_paks: false,
      set_do_not_download_paks: (do_not_download_paks) =>
        set({ do_not_download_paks }),

      editing_order_of_library: false,
      set_editing_order_of_library: (editing) =>
        set({ editing_order_of_library: editing }),

      use_custom_dll_path: false,
      set_use_custom_dll_path: (use_custom_dll_path) =>
        set({ use_custom_dll_path }),

      custom_dll_path: "",
      set_custom_dll_path: (custom_dll_path) => set({ custom_dll_path }),

      enable_override_password: false,
      set_enable_override_password: (enable_override_password) =>
        set({ enable_override_password }),

      override_password: "",
      set_override_password: (override_password) => set({ override_password }),
    }),
    {
      name: "retrac",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        do_not_download_paks: state.do_not_download_paks,
        custom_dll_path: state.custom_dll_path,
        show_all_widgets: state.show_all_widgets,
        override_password: state.override_password,
      }),
    }
  )
);
