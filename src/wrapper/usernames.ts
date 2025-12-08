import { create } from "zustand";

type UsernamesState = {
  cachedUsernamesLookup: Map<string, string>;
  add_from_response: (response: Record<string, string>) => void;
  add_single: (account: string, display: string) => void;
  lookup_username: (account: string) => string | null;
};

export const useUsernameLookup = create<UsernamesState>((set, get) => ({
  cachedUsernamesLookup: new Map(),

  add_from_response: (response) => {
    const cached = get().cachedUsernamesLookup;
    Object.entries(response).forEach(([key, value]) => cached.set(key, value));
    set({ cachedUsernamesLookup: cached });
  },

  add_single: (account, display) => {
    const cached = get().cachedUsernamesLookup;
    cached.set(account, display);
    set({ cachedUsernamesLookup: cached });
  },

  lookup_username: (account) => {
    const username = get().cachedUsernamesLookup.get(account);
    if (!username) return null;
    return username;
  },
}));
