import { create } from "zustand";

type RetracState = {
  players_online: number;
  set_players_online: (players_online: number) => void;

  // servers: Server[];
  // add_server: (server: Server) => void;
  // remove_server: (server: Server) => void;
  // add_player_to_server: (server: Server, player: Player) => void;
  // remove_player_from_server: (server: Server, player: Player) => void;
};

export const useRetrac = create<RetracState>((set) => ({
  players_online: 0,
  set_players_online: (players_online) => set({ players_online }),
}));
