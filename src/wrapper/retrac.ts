import { create } from "zustand";

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

  show_all_widgets: boolean;
  set_show_all_widgets: (show_all_widgets: boolean) => void;

  donation_message_popped: boolean;
  set_donation_message_popped: (donation_message_popped: boolean) => void;

  stop_auto_download_due_to_error: boolean;
  set_stop_auto_download_due_to_error: (stop: boolean) => void;
};

export const useRetrac = create<RetracState>((set) => ({
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
  show_all_widgets: false,
  set_show_all_widgets: (show_all_widgets) => set({ show_all_widgets }),

  donation_message_popped: false,
  set_donation_message_popped: (donation_message_popped) =>
    set({ donation_message_popped }),

  stop_auto_download_due_to_error: false,
  set_stop_auto_download_due_to_error: (stop) =>
    set({ stop_auto_download_due_to_error: stop }),
}));
