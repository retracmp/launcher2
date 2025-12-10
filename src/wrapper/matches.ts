import { create } from "zustand";

type MatchesState = {
  matches: Map<string, SavedMatch>;
  add_from_response: (response: Record<string, SavedMatch>) => void;
  all_matches: () => SavedMatch[];
};

export const useMatches = create<MatchesState>((set, get) => ({
  matches: new Map(),

  add_from_response: (response) => {
    const cached = get().matches;
    Object.entries(response).forEach(([key, value]) => cached.set(key, value));
    set({ matches: cached });
  },

  all_matches: () => {
    return Array.from(get().matches.values()).sort((a, b) => {
      return (
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      );
    });
  },
}));
