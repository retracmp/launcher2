import { create } from "zustand";

type UsernamesState = {
  aggregatedStats: AggregatedStats | null;
  add_from_response: (response: AggregatedStats) => void;
};

export const useAggregatedStats = create<UsernamesState>((set) => ({
  aggregatedStats: null,

  add_from_response: (response) => {
    set({ aggregatedStats: response });
  },
}));
