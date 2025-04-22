import { create } from "zustand";

type LeaderboardState = {
  _set: Map<string, LeaderboardEntry[][]>;
  _setMe: Map<string, LeaderboardEntry>;
  activeSortedBy: "eliminations" | "points" | "hype";
  _pageInfo: LeaderboardPageInfo;
  setPageInfo: (pageInfo: LeaderboardPageInfo) => void;

  _page: number;
  nextPage: () => void;
  prevPage: () => void;
  resetPage: () => void;
  setPage: (page: number) => void;

  populateLeaderboard: (
    type: string,
    leaderboard: LeaderboardEntry[],
    page: number
  ) => void;
  populateMe: (type: string, entry: LeaderboardEntry) => void;
  getLeaderboard: (
    type: string,
    page: number
  ) => LeaderboardEntry[] | undefined;
  getMe: (type: string) => LeaderboardEntry | undefined;
};

export const useLeaderboard = create<LeaderboardState>((set, get) => ({
  _pageInfo: {
    page: 1,
    pageSize: 10,
    totalPages: 0,
    totalResults: 0,
    sortBy: "eliminations",
  },
  setPageInfo: (pageInfo) => {
    set({ _pageInfo: pageInfo });
  },
  _page: 1,
  nextPage: () => {
    const _page = get()._page;
    set({ _page: _page + 1 });
  },
  prevPage: () => {
    if (get()._page <= 1) return;
    const _page = get()._page;
    set({ _page: _page - 1 });
  },
  resetPage: () => {
    set({ _page: 1 });
  },
  setPage: (page) => {
    set({ _page: page });
  },
  _set: new Map(),
  _setMe: new Map(),
  activeSortedBy: "eliminations",
  populateLeaderboard: (type, leaderboard, page) => {
    const _set = get()._set;
    let currentLeaderboard = _set.get(type);
    if (!currentLeaderboard) {
      _set.set(type, []);
      currentLeaderboard = _set.get(type);
    }
    if (!currentLeaderboard) return;
    currentLeaderboard[page] = leaderboard;
    _set.set(type, currentLeaderboard);
    set({ _set });
  },
  populateMe: (type, entry) => {
    const _set = get()._setMe;
    _set.set(type, entry);
    set({ _setMe: _set });
  },
  getLeaderboard: (type, page) => {
    const _set = get()._set;
    const currentLeaderboard = _set.get(type);
    if (!currentLeaderboard) return undefined;
    return currentLeaderboard[page];
  },
  getMe: (type) => {
    const _set = get()._setMe;
    return _set.get(type);
  },
}));
