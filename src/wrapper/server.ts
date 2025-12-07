import { create } from "zustand";

type ServerManagerState = {
  _servers: Record<string, Match>;

  set_servers: (servers: Match[]) => void;
  set_server: (server: Match) => void;
  delete_server: (server_id: string) => void;

  servers: () => Match[];
  servers_by_status: (...statuses: string[]) => Match[];

  show_eu_servers: boolean;
  set_show_eu_servers: (show_eu_servers: boolean) => void;

  show_na_servers: boolean;
  set_show_na_servers: (show_na_servers: boolean) => void;

  show_naw_servers: boolean;
  set_show_naw_servers: (show_naw_servers: boolean) => void;

  show_oce_servers: boolean;
  set_show_oce_servers: (show_oce_servers: boolean) => void;

  show_me_servers: boolean;
  set_show_me_servers: (show_eu_servers: boolean) => void;
};

export const useServerManager = create<ServerManagerState>((set, get) => ({
  _servers: {},

  set_servers: (servers) => {
    const server_map: Record<string, Match> = {};
    servers.forEach((server) => {
      server_map[server.id] = server;
    });
    set({ _servers: server_map });
  },

  set_server: (server) => {
    set((state) => ({
      _servers: { ...state._servers, [server.id]: server },
    }));
  },

  delete_server: (server_id) =>
    set((state) => {
      const new_servers = { ...state._servers };
      delete new_servers[server_id];
      return { _servers: new_servers };
    }),

  servers: () =>
    Object.values(get()._servers).sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }),

  servers_by_status: (...statuses: string[]) => {
    return Object.values(get()._servers)
      .filter((server) => statuses.includes(server.string_status))
      .filter((server) => {
        if (server.region === "EU") return get().show_eu_servers;
        if (server.region === "NA") return get().show_na_servers;
        if (server.region === "NAW") return get().show_naw_servers;
        if (server.region === "OCE") return get().show_oce_servers;
        if (server.region === "ME") return get().show_me_servers;
        if (server.region === "SHADOW") return false;
        return true;
      })
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
  },

  show_eu_servers: true,
  set_show_eu_servers: (show_eu_servers) => set({ show_eu_servers }),

  show_na_servers: true,
  set_show_na_servers: (show_na_servers) => set({ show_na_servers }),

  show_naw_servers: true,
  set_show_naw_servers: (show_naw_servers) => set({ show_naw_servers }),

  show_oce_servers: true,
  set_show_oce_servers: (show_oce_servers) => set({ show_oce_servers }),

  show_me_servers: true,
  set_show_me_servers: (show_me_servers) => set({ show_me_servers }),
}));
