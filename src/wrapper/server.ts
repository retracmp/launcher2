import { create } from "zustand";

type ServerManagerState = {
  _servers: Record<string, BackendServer>;

  set_servers: (servers: BackendServer[]) => void;
  set_server: (server: BackendServer) => void;
  delete_server: (server_id: string) => void;

  servers: () => BackendServer[];
  servers_by_status: (...statuses: string[]) => BackendServer[];

  show_eu_servers: boolean;
  set_show_eu_servers: (show_eu_servers: boolean) => void;

  show_na_servers: boolean;
  set_show_na_servers: (show_na_servers: boolean) => void;
};

export const useServerManager = create<ServerManagerState>((set, get) => ({
  _servers: {},

  set_servers: (servers) => {
    const server_map: Record<string, BackendServer> = {};
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
}));
