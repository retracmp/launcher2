import { create } from "zustand";

type RetracState = {
  players_online: number;
  set_players_online: (players_online: number) => void;

  launcher_news: LauncherNewsItem[];
  set_launcher_news: (launcher_news: LauncherNewsItem[]) => void;

  events: LauncherEventItem[];
  set_events: (events: LauncherEventItem[]) => void;
  // servers: Server[];
  // add_server: (server: Server) => void;
  // remove_server: (server: Server) => void;
  // add_player_to_server: (server: Server, player: Player) => void;
  // remove_player_from_server: (server: Server, player: Player) => void;
};

export const useRetrac = create<RetracState>((set) => ({
  players_online: 0,
  set_players_online: (players_online) => set({ players_online }),
  launcher_news: [],
  set_launcher_news: (launcher_news) => set({ launcher_news }),
  events: [],
  set_events: (events) => set({ events }),
}));
