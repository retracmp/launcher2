import { create } from "zustand";

type ServerManagerState = {
  _servers: Record<string, Server>;

  set_servers: (servers: Server[]) => void;
  set_server: (server: Server) => void;
  delete_server: (server_id: string) => void;

  servers: () => Server[];
  servers_by_status: (...statuses: string[]) => Server[];
};

export const useServerManager = create<ServerManagerState>((set, get) => ({
  _servers: {},

  set_servers: (servers) => {
    const server_map: Record<string, Server> = {};
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
    console.log(statuses);
    return Object.values(get()._servers)
      .filter((server) => statuses.includes(server.string_status))
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
  },
}));
